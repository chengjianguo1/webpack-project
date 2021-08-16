const proxy = {
    '/tarsier-dcv/': {
        target: 'http://192.168.1.190:1661'
    },
    '/base/': {
        target: 'http://localhost:8088',
        pathRewrite: { '^/base': '/debug/base' }
    }
};

module.exports = proxy;