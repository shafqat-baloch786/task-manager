import api_client from './api_client';

const task_service = {
  get_tasks: () => api_client.get('/tasks'),
  create_task: (data) => api_client.post('/tasks/create', data),
  update_task: (id, data) => api_client.put(`/tasks/${id}`, data),
  delete_task: (id) => api_client.delete(`/tasks/${id}`),
};

export default task_service;