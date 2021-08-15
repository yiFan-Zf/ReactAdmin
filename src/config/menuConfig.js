const menuList = [
  {
    title: '首页', // 菜单标题名称 
    key: '/home', // 对应的 path 
    // icon: 'home', // 图标名称 
    icon: 'HomeOutlined',
    isPublic: true,//公开的
  },
  {
    title: '商品',
    key: '/products',
    // icon: 'appstore',
    icon: 'QrcodeOutlined',
    children: [ // 子菜单列表 
      {
        title: '品类管理',
        key: '/category',
        // icon: 'bars'
        icon: 'BarsOutlined'
      },
      {
        title: '商品管理',
        key: '/product',
        // icon: 'tool'
        icon: 'PartitionOutlined'
      },
    ]
  },
  {
    title: '用户管理',
    key: '/user',
    // icon: 'user'
    icon: 'UserOutlined'
  },
  {
    title: '角色管理',
    key: '/role',
    // icon: 'safety',
    icon: 'SafetyOutlined',
  },
  {
    title: '图形图表',
    key: '/chart',
    // icon: 'area-chart',
    icon: 'AreaChartOutlined',
    children: [
      {
        title: '柱形图',
        key: '/chart/bar',
        // icon: 'bar-chart'
        icon: 'BarChartOutlined'
      },
      {
        title: '折线图',
        key: '/chart/line',
        // icon: 'line-chart'
        icon: 'LineChartOutlined'
      },
      {
        title: '饼图',
        key: '/chart/pie',
        // icon: 'pie-chart'
        icon: 'PieChartOutlined'
      },
    ]
  },
]

export default menuList