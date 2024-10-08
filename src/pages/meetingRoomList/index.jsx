import { getUserInfo } from '@/utils/token';
import { omitObjEmpty } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, Divider, message, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { meetingRoomActions, meetingRoomStatus } from '../../utils/dict';
import { getMeetingRoomList, updateMeetingRoom } from './api';
import MeetingRoom from './components/meetingRoom';
import ReserveMeetingRoom from './components/reserveMeetingRoom';
import { roomList } from './mockData';

export default function MeetingRoomList() {
  const { admin } = getUserInfo();
  const { t } = useTranslation();
  const actionRef = useRef();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(meetingRoomActions.add);
  const [isReserveModelOpen, setIsReserveModalOpen] = useState(false);
  const [curRoom, setCurRoom] = useState();
  const [curMeetingRoom, setCurMeetingRoom] = useState(null);
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
      render: (text, record, index) => {
        const { status, id } = record;
        const newStatus = status === 0 ? 1 : 0;
        return (
          <>
            {isAdmin && (
              <>
                <a onClick={changeMeetingRoomStatus(record, index)}>
                  {t(`mrl.columns.actions.${meetingRoomStatus[newStatus]}`)}
                </a>
                <Divider type='vertical' />
                <a onClick={delMeetingRoom(record)}>{t('mrl.columns.actions.del')}</a>
                <Divider type='vertical' />
                <a onClick={editMeetingRoom(record)}>{t('mrl.columns.actions.edit')}</a>
                <Divider type='vertical' />
              </>
            )}
            {status === 0 && (
              <>
                <a
                  onClick={() => {
                    setIsReserveModalOpen(true);
                    setCurRoom(id);
                  }}>
                  {t('mrl.columns.actions.reserve')}
                </a>
                <Divider type='vertical' />
              </>
            )}
            <a onClick={() => navigate('/reservation-list', { state: { roomId: id } })}>
              {t('mrl.columns.actions.toRl')}
            </a>
          </>
        );
      },
    },
  ];

  const closeModel = () => {
    setIsModalOpen(false);
  };

  const reload = () => {
    actionRef.current.reload();
  };

  // 删除会议室
  const delMeetingRoom = (record) => async () => {
    const { id } = record;
    setLoading(true);
    const { success } = await updateMeetingRoom({ id, status: -1 });
    setLoading(false);
    if (success) {
      message.success(t(`mrl.msg.changeStatus.del.success`));
      // 重新加载数据
      reload();
    }
  };

  // 编辑会议室
  const editMeetingRoom = (record) => () => {
    setIsModalOpen(true);
    setCurMeetingRoom(record);
    setModalType(meetingRoomActions.edit);
  };

  // 启用、禁用
  const changeMeetingRoomStatus = (record, index) => async () => {
    const { id, status } = record;
    setLoading(true);
    const newStatus = status === 0 ? 1 : 0;
    const { success } = await updateMeetingRoom({ id, status: newStatus });
    if (success) {
      dataSource[index].status = newStatus;
      setDataSource([...dataSource]);
      message.success(t(`mrl.msg.changeStatus.${meetingRoomStatus[status]}.success`));
    }
    setLoading(false);
  };

  const tableRequest = async (params) => {
    setLoading(true);
    const { pageSize, status, ...otherParams } = params;
    const getListParams = omitObjEmpty({
      size: pageSize,
      status: [0, 1].includes(Number(status)) ? [Number(status)] : undefined,
      ...otherParams,
    });
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
  const closeReserveModel = () => {
    setIsReserveModalOpen(false);
  };
  return (
    <Spin spinning={loading}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
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
                <Button
                  key='button'
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalType(meetingRoomActions.add);
                  }}
                  icon={<PlusOutlined />}
                  type='primary'>
                  {t('mrl.new')}
                </Button>,
              ]
            : null
        }
      />
      <MeetingRoom
        isModalOpen={isModalOpen}
        modalType={modalType}
        closeModel={closeModel}
        reload={reload}
        initialValue={cloneDeep(curMeetingRoom)}
      />
      <ReserveMeetingRoom
        isModalOpen={isReserveModelOpen}
        closeModel={closeReserveModel}
        initialValue={{ roomId: curRoom }}
      />
    </Spin>
  );
}
