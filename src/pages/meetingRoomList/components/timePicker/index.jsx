import { dateTimeformat } from '@/utils/dict';
import { getUserInfo } from '@/utils/token';
import { message } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';

const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const arr2 = [1, 2, 3, 4];

// 24小时。每30分钟为一个时间段。共计 4 * 12 = 48 个可选时间段
const timeList = arr1.map((_, i) => {
  return arr2.map((_, j) => {
    const start_hour = j < 2 ? i * 2 : i * 2 + 1;
    const start_minutes = j % 2 === 0 ? '00' : '30';
    const end_hour = j === 0 ? i * 2 : j === 3 ? i * 2 + 2 : i * 2 + 1;
    const end_minutes = j % 2 === 0 ? '30' : '00';
    return {
      start: `${start_hour}:${start_minutes}`,
      end: `${end_hour}:${end_minutes}`,
      id: i * 4 + (j + 1), //id
    };
  });
});

const TimePicker = React.forwardRef((props, ref) => {
  const { date, reservationList } = props;
  const [selectedTime, setSelectedTime] = useState([]);
  const { t } = useTranslation();
  const { admin } = getUserInfo();

  useEffect(() => {
    // 每次切换 日期、会议室 ，清空当前已选的时间段
    if (selectedTime.length !== 0) setSelectedTime([]);
  }, [date, reservationList]);

  const selectTime = (item) => {
    // 判断当前是否已经选中了。
    const selectedIndex = selectedTime.findIndex((time) => {
      return time.id === item.id;
    });
    // 没选，则选中
    if (selectedIndex === -1) {
      setSelectedTime([...selectedTime, item]);
      return;
    }
    // 已选，则删除
    selectedTime.splice(selectedIndex, 1);
    setSelectedTime([...selectedTime]);
  };

  const onClickTimeItem = (item, disable) => () => {
    if (!disable) selectTime(item);
  };
  const genTimeList = () => {
    return timeList.map((list) => {
      return list.map((item) => {
        const { start, end, id } = item;
        const selected = selectedTime.find((time) => {
          return time.id === id;
        });
        const disabled = reservationList[id - 1] === 1; // 0未占用，1已占用
        return (
          <span
            className={`${style.picker_item} ${selected ? style.picker_item_selected : ''} ${disabled ? style.picker_item_disabled : ''}`}
            key={id}
            onClick={onClickTimeItem(item, disabled)}>
            {start} - {end}
          </span>
        );
      });
    });
  };

  /**
   * date : 'YYYY-MM-DD'
   * return的起止时间格式：'YYYY-MM-DD HH:mm:ss'
   * */
  const validateTime = (date) => {
    // 选择的时间段的 id 从小到大排序
    const timeOrder = selectedTime.map(({ id }) => id);
    timeOrder.sort((x, y) => x - y);
    // 1. 必须是连续的时间段
    let isContinuous = true;
    timeOrder.forEach((id, index) => {
      if (index === timeOrder.length - 1) return; //最后一个不需要判断
      if (timeOrder[index + 1] - id > 1) isContinuous = false; // 后 -  前 > 1  就不是连续
    });
    if (!isContinuous) {
      message.error(t('mrl.meeting-room.modal.reserve.err.continuous'));
      return false;
    }

    // 2. 普通用户选择时间不超 2h。admin用户不得超过24h。但 目前暂不支持跨天
    if (timeOrder.length > (admin ? 48 : 4)) {
      message.error(t('mrl.meeting-room.modal.reserve.err.' + (admin ? '24h' : '2h')));
      return false;
    }

    // 3. 若选择的日期是当日 ，则 不得选择早于当前时刻的时间段
    const { start } = selectedTime.find(({ id }) => id === timeOrder[0]);
    const now = +new Date();
    const startTime = +new Date(`${date} ${start}`);
    if (startTime < now) {
      message.error(t('mrl.meeting-room.modal.reserve.err.early'));
      return false;
    }

    // 校验成功，则返回 开始、结束时间
    const { end } = selectedTime.find(({ id }) => id === timeOrder[timeOrder.length - 1]);
    return {
      start: dayjs(`${date} ${start}`).format(dateTimeformat),
      end: dayjs(`${date} ${end}`).format(dateTimeformat),
    };
  };

  // 向父组件暴露子组件的 方法、data。
  useImperativeHandle(
    ref,
    () => ({ validateTime }), //父组件通过ref获取值，要在这里抛出
  );

  return <div className={style.time_picker}>{genTimeList()}</div>;
});
TimePicker.displayName = 'TimePicker';
TimePicker.propTypes = { date: PropTypes.any, reservationList: PropTypes.array };
export default TimePicker;
