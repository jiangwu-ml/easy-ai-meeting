import { meetingRoomActions } from '@/utils/dict';
import { Form, Input, InputNumber, message, Modal, Spin, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addMeetingRoom, updateMeetingRoom } from '../api';

MeetingRoom.propTypes = {
  closeModel: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool,
  initialValue: PropTypes.any,
  modalType: PropTypes.string.isRequired,
};

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
  style: {
    maxWidth: 600,
    margin: '40px 10px',
  },
};
export default function MeetingRoom(props) {
  const {
    isModalOpen = true,
    closeModel = () => {},
    modalType = meetingRoomActions.add,
    reload = () => {},
    initialValue = { status: true },
  } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue({ ...initialValue, status: initialValue.status === 0 ? true : false }); //status取值 0 或 1 ，要匹配switch开关的值： true false
    }
  }, [initialValue]);

  const onFinish = async () => {
    // 提交
    setLoading(true);
    const value = form.getFieldsValue();
    const params = { ...value, status: value.status ? 0 : 1 }; //switch开关的默认值是 true false 要转化为 0 1
    const { success } = await (modalType === meetingRoomActions.add
      ? addMeetingRoom(params)
      : updateMeetingRoom({ ...params, id: initialValue.id }));
    setLoading(false);
    if (success) {
      // 关闭弹窗
      closeModel();
      // 刷新页面
      reload();
      message.success(t(`mrl.msg.${modalType}.success`));
    }
  };

  return (
    <Spin spinning={loading}>
      <Modal
        title={t(`mrl.meeting-room.modal.${modalType}`)}
        okText={t('mrl.meeting-room.modal.submit')}
        open={isModalOpen}
        onOk={() => form?.submit()}
        onCancel={closeModel}
        destroyOnClose
        maskClosable={false}
        transitionName=''
        maskTransitionName=''>
        <Form name='meetingRoom' form={form} {...formLayout} onFinish={onFinish}>
          <Form.Item
            label={t('mrl.columns.roomName')}
            name='roomName'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.columns.roomName'),
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label={t('mrl.columns.capacity')}
            name='capacity'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.columns.capacity'),
              },
            ]}>
            <InputNumber min={1} max={1000} />
          </Form.Item>
          <Form.Item
            label={t('mrl.columns.status')}
            name='status'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.columns.status'),
              },
            ]}>
            <Switch
              checkedChildren={t('mrl.columns.actions.enable')}
              unCheckedChildren={t('mrl.columns.actions.disable')}
            />
          </Form.Item>
          <Form.Item
            label={t('mrl.columns.location')}
            name='location'
            rules={[
              {
                required: true,
                message: t('mrl.modal.msg.require') + t('mrl.columns.location'),
              },
            ]}>
            <TextArea
              autoSize={{
                minRows: 2,
                maxRows: 3,
              }}
            />
          </Form.Item>
          <Form.Item label={t('mrl.columns.equipment')} name='equipment'>
            <TextArea
              autoSize={{
                minRows: 2,
                maxRows: 3,
              }}
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
}
