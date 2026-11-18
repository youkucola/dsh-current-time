import { CURRENT_TIME_DESCRIPTION, getCurrentTime } from './lib/time.mjs';

export default {
  id: 'dsh-current-time',
  name: '当前时间',
  version: '1.0.0',
  api: 1,
  setup(api) {
    api.tool(api.defineTool({
      name: 'get_current_time',
      description: CURRENT_TIME_DESCRIPTION,
      properties: {},
      required: [],
      execute: async () => getCurrentTime(),
    }));
  },
};
