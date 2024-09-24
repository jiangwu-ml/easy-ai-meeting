import { getUserInfo } from '@/utils/token';
import { omitObjEmpty } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Divider, message, Spin } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { meetingRoomStatus } from '../../utils/dict';
import { getMeetingRoomList, updateMeetingRoom } from './api';
import { roomList } from './mockData';

const { admin } = getUserInfo();
export default function MeetingRoomList() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [isAdmin] = useState(admin);
  const navigate = useNavigate();

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: t('mrl.columns.index'),
      width: 48,
      search: false,
    },
    {
      title: t('mrl.columns.roomName'),
      dataIndex: 'roomName',
      search: true,
      ellipsis: true,
    },
    {
      title: t('mrl.columns.location'),
      dataIndex: 'location',
      search: true,
      ellipsis: true,
    },
    {
      title: t('mrl.columns.capacity'),
      dataIndex: 'capacity',
      valueType: 'digit',
      search: false,
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
      render: (text, record, index, action) => {
        const { status, id } = record;
        return (
          <>
            <a onClick={changeMeetingRoomStatus(record, index)}>
              {t(`mrl.columns.actions.${meetingRoomStatus[status].action}`)}
            </a>
            <Divider type='vertical' />
            <a onClick={() => navigate('/reservation-list', { state: { roomId: id } })}>
              {t(`mrl.columns.actions.toRl`)}
            </a>
            <Divider type='vertical' />
            <TableDropdown
              key='actionGroup'
              onSelect={() => action?.reload()}
              menus={[
                { key: 'copy', name: '复制' },
                { key: 'delete', name: '删除' },
              ]}
            />
          </>
        );
      },
    },
  ];
  const changeMeetingRoomStatus = (record, index) => async () => {
    const { id, status } = record;
    setLoading(true);
    const newStatus = status === 0 ? 1 : 0;
    const { success } = await updateMeetingRoom({ id, status: newStatus });
    if (success) {
      dataSource[index].status = newStatus;
      setDataSource([...dataSource]);
      message.success(t(`mrl.msg.changeStatus.${meetingRoomStatus[status].action}.success`));
    }
    setLoading(false);
  };

  const tableRequest = async (params) => {
    setLoading(true);
    const { pageSize, status, ...otherParams } = params;
    const getListParams = {
      size: pageSize,
      status: ['0', '1'].includes(status) ? [status] : undefined,
      ...otherParams,
    };
    console.log('getListParams', getListParams, omitObjEmpty(getListParams));
    const {
      success,
      data: { total, records = [] },
    } = await getMeetingRoomList(getListParams);
    if (success) {
      setLoading(false);
      setDataSource(records);
      setTotal(total);
      setLoading(false);
    }
    // return {
    //   data: records,
    //   success, // success 请返回 true，不然 table 会停止解析数据，即使有数据
    //   total, // 不传会使用 data 的长度，如果是分页一定要传
    // };
  };
  return (
    <Spin spinning={loading}>
      <ProTable
        columns={columns}
        search={{ defaultCollapsed: false }}
        cardBordered
        request={tableRequest}
        dataSource={dataSource}
        rowKey='id'
        options={false} // 新增按钮的右边 、table 工具栏，设为 false 时不显示，
        pagination={{
          showSizeChanger: true,
          total: total,
        }}
        defaultData={roomList}
        headerTitle={t('mrl.header-title')}
        toolBarRender={() =>
          isAdmin
            ? [
                <Button key='button' icon={<PlusOutlined />} type='primary'>
                  {t('mrl.new')}
                </Button>,
              ]
            : null
        }
      />
    </Spin>
  );
}
