import React, { useEffect, useState } from "react";
import { Button, Card, List, Space, Spin, Tag, Typography, message } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import "./style.css";
import {
  getMyNotifications,
  markNotificationRead,
} from "../../services/notifications/notificationsServices";

const { Title, Text } = Typography;

function NotificationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const userType = getCookie("userType");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      const backendMsg = e?.response?.data?.message;
      message.error(
        backendMsg
          ? Array.isArray(backendMsg)
            ? backendMsg.join(", ")
            : backendMsg
          : "Không thể tải thông báo",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userType) {
      message.warning("Vui lòng đăng nhập để xem thông báo");
      return;
    }
    load();
  }, []);

  const onMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: 1 } : n)));
    } catch (e) {
      message.error("Không thể đánh dấu đã đọc");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <Card className="notifications-card" bodyStyle={{ padding: 24 }}>
        <div className="notifications-header">
          <Title level={3} style={{ margin: 0 }}>
            <Space>
              <BellOutlined />
              Thông báo
            </Space>
          </Title>
          <Button onClick={load}>Tải lại</Button>
        </div>

        <div style={{ marginTop: 16 }}>
          <List
            className="notifications-list"
            dataSource={items}
            locale={{ emptyText: "Chưa có thông báo" }}
            renderItem={(item) => (
              <List.Item className="notifications-list-item">
                <div className={`notification-item ${item.read ? "is-read" : "is-unread"}`}>
                  <div className="notification-top">
                    <div className="notification-title-row">
                      <Text strong className="notification-title">{item.title}</Text>
                      {!item.read ? <Tag color="red">Mới</Tag> : <Tag color="green">Đã đọc</Tag>}
                    </div>
                    <Text type="secondary" className="notification-time">
                      {item.created_at ? new Date(item.created_at).toLocaleString("vi-VN") : ""}
                    </Text>
                  </div>

                  {item.message ? <div className="notification-message">{item.message}</div> : null}

                  <div className="notification-actions">
                    {!item.read ? (
                      <Button size="small" onClick={() => onMarkRead(item.id)}>
                        Đánh dấu đã đọc
                      </Button>
                    ) : null}
                    {item.link ? (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          if (!item.read) onMarkRead(item.id);
                          navigate(item.link);
                        }}
                      >
                        Mở
                      </Button>
                    ) : null}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Card>
    </div>
  );
}

export default NotificationsPage;
