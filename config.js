// API配置文件
// 部署到腾讯云后，需要将API_URL修改为你的云函数访问地址
// 格式：https://你的环境ID.service.tcloudbase.com/chat

const config = {
    // 默认使用相对路径，兼容Vercel部署
    // 部署到腾讯云后，请修改为你的云函数HTTP访问路径
    API_URL: '/api/chat',

    // 腾讯云部署后，将上面的API_URL改成类似下面的格式：
    // API_URL: 'https://你的环境ID.service.tcloudbase.com/chat'
};
