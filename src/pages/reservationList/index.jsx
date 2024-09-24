import { ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Popover, Spin } from 'antd';
import { isNil } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { cancelReservation, getReservationList } from './api';

export default function ReservationList() {
  const actionRef = useRef();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const formRef = useRef();

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: t('mrl.columns.index'),
      width: 48,
      search: false,
    },
    {
      title: t('rl.columns.roomName'),
      dataIndex: 'roomName',
      search: false,
      ellipsis: true,
    },
    {
      title: t('rl.columns.roomId'),
      dataIndex: 'roomId',
      search: true,
      ellipsis: true,
    },
    {
      title: t('rl.columns.userName'),
      dataIndex: 'userName',
      search: false,
      ellipsis: true,
    },
    {
      title: t('rl.columns.userId'),
      dataIndex: 'userId',
      search: false,
      ellipsis: true,
    },
    {
      title: t('rl.columns.time'),
      dataIndex: 'start',
      search: false,
      ellipsis: true,
      width: 320,
      render: (_, { startTime, endTime }) => {
        const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
        const end = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
        const content = `${start} ~ ${end}`;
        return <Popover content={content}>{content}</Popover>;
      },
    },
    {
      title: t('mrl.columns.status'),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: t('mrl.columns.onLine'),
          status: 'Success',
        },
        1: {
          text: t('mrl.columns.offLine'),
          status: 'Default',
        },
      },
    },
    {
      title: t('mrl.columns.actions'),
      key: 'actions',
      search: false,
      render: (_, record, index) => {
        const { id } = record;
        return (
          <Popconfirm title={t('msg.confirm.cancel')} onConfirm={cancelRes(id, index)}>
            <a style={{ marginLeft: 16 }}>{t('rl.columns.actions.cancel')}</a>
          </Popconfirm>
        );
      },
    },
  ];
  useEffect(() => {
    const { roomId } = state || {};
    if (!isNil(roomId)) formRef.current.setFieldsValue({ roomId });
  }, []);

  // 取消预订
  const cancelRes = (id) => async () => {
    console.log('id', id);
    const { success } = await cancelReservation(id);
    if (success) {
      actionRef.current.reload();
      message.success(t(`rl.msg.cancelReservation.success`));
    }
    setLoading(false);
  };
  // 请求数据
  const tableRequest = async (params) => {
    setLoading(true);
    const { pageSize, status, ...otherParams } = params;
    const getListParams = {
      size: pageSize,
      status: ['0', '1'].includes(status) ? [status] : undefined,
      ...otherParams,
    };
    const {
      success,
      data: { total, records = [] },
    } = await getReservationList(getListParams);
    setLoading(false);
    if (success) {
      return {
        data: records,
        success, // success 请返回 true，不然 table 会停止解析数据，即使有数据
        total, // 不传会使用 data 的长度，如果是分页一定要传
      };
    } else {
      return {
        data: [],
        success: false, // success 请返回 true，不然 table 会停止解析数据，即使有数据
        total: 0, // 不传会使用 data 的长度，如果是分页一定要传
      };
    }
  };
  return (
    <Spin spinning={loading}>
      <ProTable
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        search={{ defaultCollapsed: false }}
        cardBordered
        request={tableRequest}
        rowKey='id'
        options={false}
        pagination={{
          showSizeChanger: true,
        }}
        headerTitle={t('rl.header-title')}
      />
    </Spin>
  );
}
