import Mock from "../mock";
import { nanoid } from "nanoid";

const NotificationDB = {
  list: [
    {
      id: nanoid(),
      heading: "Message",
      icon: { name: "chat", color: "primary" },
      timestamp: 1570702802573,
      title: "New message from Devid",
      subtitle: "Hello, Any progress...",
      path: "chat"
    },
    {
      id: nanoid(),
      heading: "Alert",
      icon: { name: "notifications", color: "error" },
      timestamp: 1570702702573,
      title: "Server overloaded",
      subtitle: "Traffice reached 2M",
      path: "page-layouts/user-profile"
    },
    {
      id: nanoid(),
      heading: "Message",
      icon: { name: "chat", color: "primary" },
      timestamp: 1570502502573,
      title: "New message from Goustove",
      subtitle: "Hello, send me details",
      path: "chat"
    }
  ]
};

Mock.onGet("/api/notification").reply(() => {
  const response = NotificationDB.list;
  return [200, response];
});

Mock.onPost("/api/notification/add").reply(() => {
  const response = NotificationDB.list;
  return [200, response];
});

Mock.onPost("/api/notification/delete").reply((config) => {
  let { id } = JSON.parse(config.data);
  console.log(config.data);

  const response = NotificationDB.list.filter((notification) => notification.id !== id);
  NotificationDB.list = [...response];
  return [200, response];
});

Mock.onPost("/api/notification/delete-all").reply(() => {
  NotificationDB.list = [];
  const response = NotificationDB.list;
  return [200, response];
});
