import { useMeetingRoomSearchList } from '@/pages/reservationList/useHook';
import { dateformat } from '@/utils/dict';
import { getUserInfo } from '@/utils/token';
import { isNil } from '@ant-design/pro-components';
import { DatePicker, Form, message, Modal, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bookMeetingRoom, getTimeOccupyList } from '../api';
import TimePicker from './timePicker';

// 为了解决一个报错 clone.weekday is not a function 。原文链接：https://blog.csdn.net/weixin_47287832/article/details/129270953
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

// https://blog.csdn.net/tiven_/article/details/135128689
ReserveMeetingRoom.propTypes = {
  closeModel: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool,
  initialValue: PropTypes.any,
};

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
  style: {
    margin: '40px 10px',
  },
};

export default function ReserveMeetingRoom(props) {
  const { isModalOpen = true, closeModel = () => {}, initialValue = { roomId: null, date: null } } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { date: formDate } = form.getFieldsValue();
  const [loading, setLoading] = useState(false);
  const { meetingRoomList } = useMeetingRoomSearchList();
  const timePickerRef = useRef();
  const { userId } = getUserInfo();
  const [reservationListByDate, setReservationListByDate] = useState([]); //当前 选中会议室 的未来2周 的预订记录
  const [reservationList, setReservationList] = useState([]); //当前 选中会议室、选中日期  的预订记录

  useEffect(() => {
    const { roomId } = initialValue;
    form.setFieldsValue({ ...initialValue });
    if (!isNil(roomId)) handleRoomIdChange(roomId); //初始化时获取默认选择的会议室的预订信息
  }, [initialValue]);

  const onFinish = async () => {
    const { date, roomId } = form.getFieldsValue();
    const formatDate = date.format(dateformat);
    // 校验选择的时间段，校验通过则返回 起止时间
    const timeSeg = timePickerRef.current.validateTime(formatDate);
    if (!timeSeg) return;

    // 提交
    const params = {
      start: timeSeg.start,
      end: timeSeg.end,
      roomId,
      userId,
      lock: false,
    };
    setLoading(true);
    const { success } = await bookMeetingRoom(params);
    setLoading(false);
    if (success) {
      message.success(t('mrl.meeting-room.modal.reserve.success'));
      closeModel();
    }
  };

  const handleRoomIdChange = async (roomId) => {
    // 获取当前会议室 当天及未来13天的预订记录。
    const { date } = form.getFieldsValue();
    setLoading(true);
    const { success, data } = await getTimeOccupyList(roomId);
    setLoading(false);
    if (success) {
      setReservationListByDate(data);
      // 若当前已选择某个日期,则给ReservationList赋值
      if (date) {
        const formtDate = dayjs(date).format(dateformat);
        handelDateChange(date, formtDate, data);
      }
    }
  };

  // onchange 事件 ：function(date: dayjs, dateString: string)
  const handelDateChange = (date, dateString, list = reservationListByDate) => {
    const { timeOccupyList = [] } = list?.find(({ date }) => date === dateString) || {}; //查找出当前选择日期对应的预订记录
    setReservationList(timeOccupyList);
  };

  return (
    <Modal
      title={t(`mrl.meeting-room.modal.reserve`)}
      okText={t('mrl.meeting-room.modal.submit')}
      cancelText={t('msg.modal.cancelText')}
      open={isModalOpen}
      onOk={() => form?.submit()}
      onCancel={closeModel}
      destroyOnClose={true}
      maskClosable={false}
      width={650}
      transitionName=''
      maskTransitionName=''>
      <Spin spinning={!!loading}>
        <Form name='meetingRoom' form={form} {...formLayout} onFinish={onFinish}>
          <Form.Item
            label={t('mrl.modal.reserve.meetingRoom')}
            name='roomId'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.modal.reserve.meetingRoom'),
              },
            ]}>
            <Select options={meetingRoomList} onChange={handleRoomIdChange} />
          </Form.Item>
          <Form.Item
            label={t('mrl.modal.reserve.date')}
            name='date'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.modal.reserve.date'),
              },
            ]}>
            <DatePicker minDate={dayjs()} maxDate={dayjs().add(13, 'days')} onChange={handelDateChange} />
          </Form.Item>
          <Form.Item
            label={t('mrl.modal.reserve.time')}
            name='date'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.modal.reserve.time'),
              },
            ]}>
            <TimePicker ref={timePickerRef} date={formDate} reservationList={reservationList} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
