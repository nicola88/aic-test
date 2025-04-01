import React, { useState } from 'react';
import { Calendar, Modal, Form, Input, Button, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';

const EventForm: React.FC<{ visible: boolean, onCancel: () => void, onOk: (values: any) => void, selectedDate: dayjs.Dayjs | null }> = ({
  visible,
  onCancel,
  onOk,
  selectedDate
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (selectedDate) {
      form.setFieldsValue({
        date: selectedDate,
      });
    }
  }, [selectedDate, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      form.resetFields();
      onOk(values);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      visible={visible}
      title="Add New Event"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="date"
          label="Date"
        >
          <DatePicker disabled />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the event title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CalendarApp: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [events, setEvents] = useState<{ [date: string]: { title: string; description?: string }[] }>({});

  const onSelect = (value: dayjs.Dayjs) => {
    setSelectedDate(value);
    setIsModalVisible(true);
  };

  const handleOk = (values: { title: string, description?: string, date: dayjs.Dayjs }) => {
    setIsModalVisible(false);
    if (selectedDate) {
      const dateString = selectedDate.format('YYYY-MM-DD');
      const newEvents = { ...events };
      if (!newEvents[dateString]) {
        newEvents[dateString] = [];
      }
      newEvents[dateString].push({ title: values.title, description: values.description });
      setEvents(newEvents);
      setSelectedDate(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const dateCellRender = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    const dayEvents = events[dateString];
    return (
      <div>
        {dayEvents && dayEvents.map((event, index) => (
          <div key={index} style={{ marginTop: 4, fontSize: 12 }}>
            {event.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Typography.Title level={2}>Calendar</Typography.Title>
      <Calendar onSelect={onSelect} dateCellRender={dateCellRender} />
      <EventForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarApp;