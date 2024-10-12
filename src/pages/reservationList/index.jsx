import { meetingRoomStatus } from '@/utils/dict';
import { getUserInfo } from '@/utils/token';
import { omitObjEmpty } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Popover, Select, Spin } from 'antd';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ReserveMeetingRoom from '../meetingRoomList/components/reserveMeetingRoom';
import { cancelReservation, getMeetingRoomSearchList, getReservationList, getUserSearchList } from './api';
import style from './style.module.scss';

export default function ReservationList() {
  const { admin } = getUserInfo();
  const actionRef = useRef();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [isReserveModelOpen, setIsReserveModalOpen] = useState(false);

  const renderFormItem = (_, something) => {
    const { options } = something;
    return (
      <Select
        mode='multiple'
        allowClear
        placeholder={t('please.select')}
        options={options}
        className={style.mutiple_select}
      />
    );
  };

  const baseColumns = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: t('mrl.columns.index'),
      width: 55,
      search: false,
    },
    {
      title: t('rl.columns.roomName'),
      dataIndex: 'roomName',
      search: false,
      ellipsis: true,
    },
    {
      title: t('rl.columns.userName'),
      dataIndex: 'userName',
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
      search: false,
      valueEnum: {
        0: {
          text: t('mrl.columns.actions.' + meetingRoomStatus[0]),
          status: 'Success',
        },
        1: {
          text: t('mrl.columns.actions.' + meetingRoomStatus[1]),
          status: 'Error',
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
    // 以下两列，只用于搜索， 不展示在table里
    {
      title: t('rl.columns.roomIdList'),
      dataIndex: 'roomIdList',
      search: true, //在搜索栏内展示
      hideInTable: true, //在Table中隐藏
      initialValue: state?.roomId ? [state.roomId] : undefined, //通过此属性实现 默认值
      /** request
       * 大部分时候我们是从网络中获取数据，但是获取写一个 hooks 来请求数据还是比较繁琐的，同时还要定义一系列状态，所以我们提供了 request 和 params 来获取数据。
       * request ：是一个 promise，需要返回一个 options 相同的数据
       * params ：一般而言 request 是惰性的，params 修改会触发 request 的重新请求。
       * */
      request: async () => {
        const { data = [] } = await getMeetingRoomSearchList();
        const userList = data.map(({ id, roomName }) => {
          return { label: roomName, value: id };
        });
        return userList;
      },
      params: '/user/searchList', //此处并不发生改变
      /* renderFormItem 方法 。返回的内容，是渲染查询表单的输入组件。*/
      renderFormItem,
      /* render 方法 。返回的内容，是渲染在表格里的。*/
      // render: () => {
      //   return xxx
      // },
    },
  ];
  const columns = admin
    ? [
        ...baseColumns,
        {
          title: t('rl.columns.userIdList'),
          dataIndex: 'userIdList',
          search: true,
          hideInTable: true,
          request: async () => {
            const { data = [] } = await getUserSearchList();
            const userList = data.map(({ id, name }) => {
              return { label: name, value: id };
            });
            return userList;
          },
          params: '/user/searchListc',
          renderFormItem,
        },
      ]
    : baseColumns;

  // 取消预订
  const cancelRes = (id) => async () => {
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
    const { pageSize, ...otherParams } = params;
    const getListParams = omitObjEmpty({
      size: pageSize,
      ...otherParams,
    });
    const { success, data: { total, records } = { total: 0, records: [] } } = await getReservationList(getListParams);
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
  const closeModel = () => {
    setIsReserveModalOpen(false);
  };

  return (
    <Spin spinning={!!loading}>
      <ProTable
        columns={columns}
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
        toolBarRender={() => [
          <Button
            key='button'
            onClick={() => {
              setIsReserveModalOpen(true);
            }}
            icon={<PlusOutlined />}
            type='primary'>
            {t('rl.add.reservation')}
          </Button>,
        ]}
      />
      <ReserveMeetingRoom isModalOpen={isReserveModelOpen} closeModel={closeModel} initialValue={{}} />
    </Spin>
  );
}
