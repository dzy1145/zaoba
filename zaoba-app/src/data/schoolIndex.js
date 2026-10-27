// 此文件由 scripts/build-school-index.mjs 生成，勿手改。
// 重新生成：node scripts/build-school-index.mjs（加 --from-api 走 GitHub contents API）
// 数据来源：拾光课程表适配仓库 ShiGuangSchedule/shiguang_warehouse（MIT 协议）
// 规模：学校 269 所，适配器 298 个（唯一脚本 288 个）
// 排序：学校按 initial + name（拼音）排序，adapters 保持上游 yaml 顺序
export const SCHOOL_INDEX = [
  {
    id: 'AUFE',
    name: '安徽财经大学',
    initial: 'A',
    folder: 'AUFE',
    adapters: [
      {
        id: 'AUFE_01',
        name: '安徽财经大学校内入口',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'aufe_01.js',
        importUrl: 'http://all.aufe.edu.cn',
        maintainer: '星河欲转',
        description: '安徽财经大学urp教务适配，进入教务系统后点击开始导入，非本校开发者适配如果有误建议提交issues'
      },
      {
        id: 'AUFE_02',
        name: '安徽财经大学Webvpn入口',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'aufe_01.js',
        importUrl: 'http://vpn.aufe.edu.cn',
        maintainer: '星河欲转',
        description: '安徽财经大学urp教务适配，进入教务系统后点击开始导入，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'AEPU',
    name: '安徽电气工程职业技术学院',
    initial: 'A',
    folder: 'AEPU',
    adapters: [
      {
        id: 'AEPU_01',
        name: '安徽电气工程职业技术学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'aepu.js',
        importUrl: 'https://zt.aepu.com.cn/http/webvpnae4cfe98f83bc8811cc5963452fd80627ab088b1bddf3f753580a56a75a714e9/ywtb-portal/official/index.html#/hall',
        maintainer: 'Haooz',
        description: '安徽电气工程职业技术学院教务系统课表导入，请先登录并进入“我的课表”页面，再点击导入！'
      }
    ]
  },
  {
    id: 'AHZYYGZ',
    name: '安徽中医药高等专科学校',
    initial: 'A',
    folder: 'AHZYYGZ',
    adapters: [
      {
        id: 'AHZYYGZ_01',
        name: '安徽中医药高等专科学校',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'AHZYYGZ.js',
        importUrl: 'https://authserver.ahzyygz.edu.cn/authserver/login?service=http://jwxt.ahzyygz.edu.cn/ahzyygzjw/caslogin',
        maintainer: 'glxgo',
        description: '安徽中医药高等专科学校青果教务适配器，非本校开发者适配，如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'BBGU',
    name: '北部湾大学',
    initial: 'B',
    folder: 'BBGU',
    adapters: [
      {
        id: 'BBGU_01',
        name: '北部湾大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'bbgu.js',
        importUrl: 'https://zhjw.bbgu.edu.cn/workspace/home',
        maintainer: 'Haooz',
        description: '北部湾大学智慧教务系统课表导入，登录统一身份认证平台后直接点击导入即可'
      }
    ]
  },
  {
    id: 'NCUT',
    name: '北方工业大学',
    initial: 'B',
    folder: 'NCUT',
    adapters: [
      {
        id: 'NCUT_01',
        name: '北方工业大学-教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ncut_01.js',
        importUrl: 'https://jwxtbk.ncut.edu.cn/jsxsd/',
        maintainer: 'EnderHCO3',
        description: '适配北方工业大学本科教务管理系统课表导入 请在导入时将\'我的课表\'后的\'第x周\'改为全部周次'
      }
    ]
  },
  {
    id: 'BTBU',
    name: '北京工商大学',
    initial: 'B',
    folder: 'BTBU',
    adapters: [
      {
        id: 'BTBU',
        name: '北京工商大学本科教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'btbu.js',
        importUrl: 'https://jwgl.btbu.edu.cn/',
        maintainer: 'lztttt',
        description: '适配北京工商大学强智教务系统，教务系统登录后即可一键导入，自动获取学期列表选择学期，兼容校园网直连与WebVPN访问'
      }
    ]
  },
  {
    id: 'BJTU',
    name: '北京交通大学',
    initial: 'B',
    folder: 'BJTU',
    adapters: [
      {
        id: 'BJTU',
        name: '北京交通大学教学支撑平台',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'bjtu.js',
        importUrl: 'https://mis.bjtu.edu.cn/home/',
        maintainer: 'Haooz',
        description: '北京交通大学课表导入，请先登录后进入教务系统，再点击导入！非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'BNUZH',
    name: '北京师范大学珠海校区',
    initial: 'B',
    folder: 'BNUZH',
    adapters: [
      {
        id: 'BNUZH_01',
        name: '北京师范大学珠海校区金智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'school.js',
        importUrl: 'https://jwxt.bnuzh.edu.cn/caslogin',
        maintainer: 'sbVAN',
        description: '北京师范大学珠海校区教务(金智/青果KINGOSOFT)适配，网络请求直取课表数据与作息时间，自动获取开学日期(可确认修改)，不依赖课表页面。登录教务系统后直接点击执行导入即可，无需切换到课表页面'
      }
    ]
  },
  {
    id: 'BUPT',
    name: '北京邮电大学',
    initial: 'B',
    folder: 'BUPT',
    adapters: [
      {
        id: 'BUPT_01',
        name: '北京邮电大学本科教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'bupt_01.js',
        importUrl: 'https://jwgl.bupt.edu.cn/jsxsd/',
        maintainer: 'cstkn',
        description: '适配北京邮电大学本科教务管理系统，登录后导入个人课表'
      }
    ]
  },
  {
    id: 'CCZU',
    name: '常州大学',
    initial: 'C',
    folder: 'CCZU',
    adapters: [
      {
        id: 'CCZU',
        name: '常州大学教务管理信息系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cczu.js',
        importUrl: 'https://zmvpn.cczu.edu.cn/http/webvpndc2d086cb5b297c15e661687e73c1549/web_jxrw/cx_kb_xsgrkb.aspx',
        maintainer: 'Haooz',
        description: '常州大学自研.NET ASPX教务系统，需通过VPN访问，进入课表页面后点击导入'
      }
    ]
  },
  {
    id: 'CZIMT',
    name: '常州机电职业技术学院',
    initial: 'C',
    folder: 'CZIMT',
    adapters: [
      {
        id: 'CZIMT_01',
        name: '常州机电职业技术学院-正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'czimt.js',
        importUrl: 'https://webapp.czimt.edu.cn',
        maintainer: 'ShallowY',
        description: '常州机电职业技术学院教务系统适配，采用新版Webapp(校内通)入口，统一身份认证后进入教务系统执行导入。'
      }
    ]
  },
  {
    id: 'chaoxing_jiaowu',
    name: '超星教务系统-通用教务',
    initial: 'C',
    folder: 'chaoxing_jiaowu',
    adapters: [
      {
        id: 'chaoxing',
        name: '超星教务系统',
        category: 'GENERAL_TOOL',
        assetJsPath: 'chaoxing.js',
        importUrl: '',
        maintainer: 'b1n23',
        description: '超星教务系统理论通用，输入教务网址，登录后点击执行导入\n支持导入开学日期和节次时间'
      }
    ]
  },
  {
    id: 'CAPU',
    name: '成都航空职业技术大学',
    initial: 'C',
    folder: 'CAPU',
    adapters: [
      {
        id: 'CAPU',
        name: '成都航空职业技术大学金智新教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'capadap.js',
        importUrl: 'https://jwxt.cap.edu.cn/jwapp/sys/homeapp/home/index.html?av=&contextPath=/jwapp#/',
        maintainer: 'Xuan-Xuann',
        description: '更新:您登录后直接点击导入即可食用,无需进入课表界面。有任何问题请通过GitHub/QQ联系开发者。'
      }
    ]
  },
  {
    id: 'CUIT',
    name: '成都信息工程大学',
    initial: 'C',
    folder: 'CUIT',
    adapters: [
      {
        id: 'CUIT_01',
        name: '成都信息工程大学本科实践教学平台',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cuit_bk_new.js',
        importUrl: 'https://ywtb.cuit.edu.cn/',
        maintainer: 'igugyj(Pfolg)',
        description: '登录（外网用户把二维码发到另一台设备），进入「本科实践教学（管理）平台」进行导入'
      },
      {
        id: 'CUIT_02',
        name: '成都信息工程大学教务管理系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cuit_bk_old.js',
        importUrl: 'https://jwc.cuit.edu.cn/',
        maintainer: 'igugyj(Pfolg)',
        description: '登录教务导入'
      }
    ]
  },
  {
    id: 'CMC',
    name: '成都医学院',
    initial: 'C',
    folder: 'CMC',
    adapters: [
      {
        id: 'CMC_01',
        name: '成都医学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cmc_01.js',
        importUrl: 'https://jwweb.cmc.edu.cn/',
        maintainer: 'linlinli000',
        description: '成都医学院乘方教务适配，请先登录教务系统后再执行导入'
      }
    ]
  },
  {
    id: 'YXHMC',
    name: '成都银杏酒店管理学院',
    initial: 'C',
    folder: 'YXHMC',
    adapters: [
      {
        id: 'YXHMC',
        name: '成都银杏酒店管理学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'yxhmc.js',
        importUrl: 'http://zfjw.gingkoc.edu.cn/xtgl/login_slogin.html',
        maintainer: 'Xuan-Xuann',
        description: '适配成都银杏酒店管理学院智慧教务系统。使用须知：请先登录再进入个人课表查询界面，然后按照流程即可导入当前课表。请注意！暂不适配调课补课，请及时关注教务系统按时修改'
      }
    ]
  },
  {
    id: 'CDUTCM',
    name: '成都中医药大学',
    initial: 'C',
    folder: 'CDUTCM',
    adapters: [
      {
        id: 'CDUTCM_01',
        name: '成都中医药大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cdutcm_01.js',
        importUrl: 'https://jwweb.cdutcm.edu.cn/',
        maintainer: 'wwwhyDB',
        description: '登录教务系统后一键导入完整课表，自动附带上课时间。\n支持单双周、多教师多地点等课程；导入时会询问学期开始日期。\n'
      }
    ]
  },
  {
    id: 'CFEC',
    name: '重庆财经学院',
    initial: 'C',
    folder: 'CFEC',
    adapters: [
      {
        id: 'CFEC_01',
        name: '重庆财经学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'CFEC.js',
        importUrl: 'http://jwmis.cfec.edu.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N2151&layout=default',
        maintainer: 'glxgo',
        description: '重庆财经学院正方教务适配器，非本校开发者适配，如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'CQCST',
    name: '重庆城市科技学院',
    initial: 'C',
    folder: 'CQCST',
    adapters: [
      {
        id: 'CQCST_01',
        name: '重庆城市科技学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqcst_01.js',
        importUrl: 'http://jw.cqcst.edu.cn/cqdxcskjxy_jsxsd/',
        maintainer: 'Mutx163',
        description: '登录后需要点击进入教务系统才可以导入，重庆城市科技学院强智适配，'
      }
    ]
  },
  {
    id: 'CQU',
    name: '重庆大学',
    initial: 'C',
    folder: 'CQU',
    adapters: [
      {
        id: 'CQU',
        name: '重庆大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqu.js',
        importUrl: 'https://my.cqu.edu.cn/',
        maintainer: '茵符草',
        description: '适配重庆大学智慧教务系统'
      }
    ]
  },
  {
    id: 'CQUET',
    name: '重庆电子科技职业大学',
    initial: 'C',
    folder: 'CQUET',
    adapters: [
      {
        id: 'CQUET_01',
        name: '强智',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cquet_01.js',
        importUrl: 'https://cquet.edu.cn/',
        maintainer: 'Mutx666',
        description: ''
      }
    ]
  },
  {
    id: 'CQIE',
    name: '重庆工程学院',
    initial: 'C',
    folder: 'CQIE',
    adapters: [
      {
        id: 'CQIE_01',
        name: '重庆工程学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqie_01.js',
        importUrl: 'https://i.cqie.edu.cn/',
        maintainer: 'haha12358',
        description: '适配重庆工程学院新教务系统，登录门户后进入教务系统页面执行导入'
      }
    ]
  },
  {
    id: 'CQTBI',
    name: '重庆工商职业学院',
    initial: 'C',
    folder: 'CQTBI',
    adapters: [
      {
        id: 'CQTBI_01',
        name: '重庆工商职业学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqtbi.js',
        importUrl: 'http://szxy.cqtbi.edu.cn/cqdddt/index.html?v=0.3672285490800563',
        maintainer: 'Haooz',
        description: '重庆工商职业学院（重庆开放大学）教务系统课表导入，请先登录并打开课表页面，再点击导入。'
      }
    ]
  },
  {
    id: 'CQEPC',
    name: '重庆航天职业技术学院',
    initial: 'C',
    folder: 'CQEPC',
    adapters: [
      {
        id: 'CQEPC_01',
        name: '重庆航天职业技术学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqepc.js',
        importUrl: 'http://jw.cqepc.cn/',
        maintainer: 'yang01',
        description: '重庆航天职业技术学院教务，请登录'
      }
    ]
  },
  {
    id: 'CQCIVC',
    name: '重庆化工职业学院',
    initial: 'C',
    folder: 'CQCIVC',
    adapters: [
      {
        id: 'CQCIVC',
        name: '重庆化工职业学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqcivc.js',
        importUrl: 'http://dc.cqcivc.cn/cas/login?service=http://jwxt.cqcivc.edu.cn/sso/zllogin',
        maintainer: '星河欲转',
        description: '重庆化工职业学院适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'CQJTU',
    name: '重庆交通大学',
    initial: 'C',
    folder: 'CQJTU',
    adapters: [
      {
        id: 'CQJTU',
        name: '重庆交通大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqjtu.js',
        importUrl: 'https://jwgln.cqjtu.edu.cn/jsxsd/sso.jsp',
        maintainer: '烛谛',
        description: '适配重庆交通大学教务系统'
      }
    ]
  },
  {
    id: 'CQUST',
    name: '重庆科技大学',
    initial: 'C',
    folder: 'CQUST',
    adapters: [
      {
        id: 'CQUST_01',
        name: '重庆科技大学本科教务 (WebVPN/推荐)',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqust_01.js',
        importUrl: 'https://web.cqust.edu.cn/',
        maintainer: 'yuexps',
        description: '通过学校统一身份认证 WebVPN 访问。登录并进入教务系统后点击导入。若页面显示异常，可在右上角切换为电脑模式。'
      },
      {
        id: 'CQUST_02',
        name: '重庆科技大学本科教务 (IPv6)',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqust_01.js',
        importUrl: 'http://jwnew.cqust.edu.ex2.http.80.ipv6.cqust.edu.cn/eams/login.action',
        maintainer: 'yuexps',
        description: '教务系统备用 IPv6 直连通道，需在支持 IPv6 的网络环境下使用。登录后点击导入。若页面显示异常，可在右上角切换为电脑模式。'
      },
      {
        id: 'CQUST_03',
        name: '重庆科技大学本科教务 (IPv4/校园网)',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqust_01.js',
        importUrl: 'http://jwnew.cqust.edu.cn/eams/login.action',
        maintainer: 'yuexps',
        description: '教务系统备用 IPv4 校园内网通道，仅限连接校园网时使用。登录后点击导入。若页面显示异常，可在右上角切换为电脑模式。'
      }
    ]
  },
  {
    id: 'CQUT',
    name: '重庆理工大学',
    initial: 'C',
    folder: 'CQUT',
    adapters: [
      {
        id: 'CQUT',
        name: '重庆理工大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqut_01.js',
        importUrl: 'https://timetable-cfc.cqut.edu.cn/',
        maintainer: 'Dawn Drizzle',
        description: '适配重庆理工大学教务系统'
      }
    ]
  },
  {
    id: 'CQRK',
    name: '重庆人文科技学院',
    initial: 'C',
    folder: 'CQRK',
    adapters: [
      {
        id: 'CQRK_01',
        name: '重庆人文科技学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cqrk_01.js',
        importUrl: 'https://https-auth-cqrk-edu-cn-443.webvpn.cqrk.edu.cn:8480/cas/login?service=http%3A%2F%2Fportal.cqrk.edu.cn&rewrite=1',
        maintainer: '星河欲转',
        description: '登录后需要点击进入教务系统才可以导入\n重庆人文科技学院强智适配，适配双季作息，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'CCIT',
    name: '长春工程学院',
    initial: 'C',
    folder: 'CCIT',
    adapters: [
      {
        id: 'CCIT',
        name: '长春工程学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ccit.js',
        importUrl: 'https://webvpn.ccit.edu.cn/auth/login',
        maintainer: '星河欲转',
        description: '长春工程学院强智教务适配，webvpn入口，请进入教务系统页面再点击导入，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'CUST',
    name: '长春理工大学',
    initial: 'C',
    folder: 'CUST',
    adapters: [
      {
        id: 'CUST_01',
        name: '长春理工大学融合课表（朝阳校区·本科）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cust_chaoyang.js',
        importUrl: 'https://kbpro.cust.edu.cn/Schedule/',
        maintainer: 'itdong',
        description: '通过融合课表适配本科生'
      },
      {
        id: 'CUST_02',
        name: '长春理工大学融合课表（朝阳校区·研究生）',
        category: 'POSTGRADUATE',
        assetJsPath: 'cust_chaoyang.js',
        importUrl: 'https://kbpro.cust.edu.cn/Schedule/',
        maintainer: 'itdong',
        description: '通过融合课表适配研究生'
      }
    ]
  },
  {
    id: 'YANGTZEU',
    name: '长江大学',
    initial: 'C',
    folder: 'YANGTZEU',
    adapters: [
      {
        id: 'YU_01',
        name: '长江大学教务系统适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'yu.js',
        importUrl: 'https://cas-yangtzeu-edu-cn.atrust.yangtzeu.edu.cn/authserver/login?service=https%3A%2F%2Fatrust.yangtzeu.edu.cn%3A4443%2Fpassport%2Fv1%2Fauth%2Fcas%3FsfDomain%3DCAS',
        maintainer: 'Jursin',
        description: '适配长江大学教务系统（树维）导入，进入教务系统后页面空白只有⌈我的账户⌋⌈返回首页⌋⌈退出⌋字样，此时点击执行导入即可'
      }
    ]
  },
  {
    id: 'CCSUT',
    name: '长沙工业学院',
    initial: 'C',
    folder: 'CCSUT',
    adapters: [
      {
        id: 'CCSUT_01',
        name: '长沙工业学院超星教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ccsut_01.js',
        importUrl: 'https://auth.ccsut.cn/backstage/cas/login?service=https%3A%2F%2Fehall.ccsut.cn%2Fbackstage%2Fcas-proxy%2Fapp%2Fredirect%3FserverName%3Dhttps%253A%252F%252Fehall.ccsut.cn%26wechatBindFlag%3D1',
        maintainer: '小漫君',
        description: '登录智慧校园后进入超星教务系统 tls.ccsut.cn 即可导入，无需打开课表页面；通过网络请求获取参数与课程，按系统实际选项选择学期与校区。'
      }
    ]
  },
  {
    id: 'DLU',
    name: '大连大学',
    initial: 'D',
    folder: 'DLU',
    adapters: [
      {
        id: 'DLU_01',
        name: '大连大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'dlu.js',
        importUrl: 'https://webvpn.dlu.edu.cn/login',
        maintainer: 'platinumyrh',
        description: '大连大学正方教务系统课表导入'
      }
    ]
  },
  {
    id: 'DLUTCI',
    name: '大连工程学院',
    initial: 'D',
    folder: 'DLUTCI',
    adapters: [
      {
        id: 'DLUTCI_01',
        name: '大连工程学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'dlutci.js',
        importUrl: 'https://jw.dlutci.edu.cn',
        maintainer: 'Haooz',
        description: '大连工程学院教务系统课表导入，登录到应用管理平台后直接点击导入即可'
      }
    ]
  },
  {
    id: 'DLMU',
    name: '大连海事大学',
    initial: 'D',
    folder: 'DLMU',
    adapters: [
      {
        id: 'DLMU_01',
        name: '大连海事大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'dlmu_01.js',
        importUrl: 'http://jw.xpaas.dlmu.edu.cn/eams',
        maintainer: 'whynusn',
        description: '大连海事大学适配教务，可能与`海大在线`中课程不一致'
      }
    ]
  },
  {
    id: 'DLUT',
    name: '大连理工大学',
    initial: 'D',
    folder: 'DLUT',
    adapters: [
      {
        id: 'DLUT_01',
        name: '大连理工大学本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'dlut_01.js',
        importUrl: 'http://jxgl.dlut.edu.cn/student/for-std/course-table',
        maintainer: 'dffzcqs78694',
        description: '登录统一身份认证后自动跳转到课表页面。\n支持自动选择学期、导入课程与作息时间、自动配置开学日期。'
      }
    ]
  },
  {
    id: 'DZU',
    name: '德州学院',
    initial: 'D',
    folder: 'DZU',
    adapters: [
      {
        id: 'DZU_01',
        name: '德州学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'dzu_deep.js',
        importUrl: 'http://211.64.47.165/jwglxt/xtgl/login_slogin.html',
        maintainer: 'yvmu',
        description: '登录后在任意页面点击执行导入，自动读取学年学期与开学日期，并写入德州学院作息时间'
      }
    ]
  },
  {
    id: 'UESTC',
    name: '电子科技大学',
    initial: 'D',
    folder: 'UESTC',
    adapters: [
      {
        id: 'UESTC_01',
        name: '电子科技大学 EAMS 教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'uestc.js',
        importUrl: 'https://eams.uestc.edu.cn/eams',
        maintainer: 'CorunLing',
        description: '登录 eams.uestc.edu.cn 后，在弹出的学期列表中选择对应学期即可自动导入。支持单双周、连周、自定义时间段。'
      }
    ]
  },
  {
    id: 'NEU',
    name: '东北大学',
    initial: 'D',
    folder: 'NEU',
    adapters: [
      {
        id: 'NEU_1',
        name: '东北大学金智教育教务适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'neu.js',
        importUrl: 'http://jwxt.neu.edu.cn/',
        maintainer: 'Vera-zero',
        description: '网页仅在校园网/连接校内vpn环境下可访问'
      },
      {
        id: 'NEU_2',
        name: '东北大学研究生金智教育教务适配',
        category: 'POSTGRADUATE',
        assetJsPath: 'neuyjs.js',
        importUrl: 'https://yjs.neu.edu.cn/',
        maintainer: 'Vera-zero',
        description: '网页仅在校园网/连接校内vpn环境下可访问'
      }
    ]
  },
  {
    id: 'NEUQ',
    name: '东北大学秦皇岛分校',
    initial: 'D',
    folder: 'NEUQ',
    adapters: [
      {
        id: 'NEUQ',
        name: '东北大学秦皇岛分校树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'neuq.js',
        importUrl: 'https://jwxt.neuq.edu.cn',
        maintainer: 'aryunm',
        description: '适用于东北大学秦皇岛分校教务系统的适配器，由非本校开发者开发，如有问题请提交issue。'
      }
    ]
  },
  {
    id: 'NEFU',
    name: '东北林业大学',
    initial: 'D',
    folder: 'NEFU',
    adapters: [
      {
        id: 'NEFU_01',
        name: '东北林业大学本部本科生院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nefu.js',
        importUrl: 'https://jwxt.nefu.edu.cn/jsxsd/',
        maintainer: 'Chr0n0stasis',
        description: '本部本科个人课表。登录后选择学期导入，保留原有作息和学期设置。'
      }
    ]
  },
  {
    id: 'NEAU',
    name: '东北农业大学',
    initial: 'D',
    folder: 'NEAU',
    adapters: [
      {
        id: 'NEAU_01',
        name: '东北农业大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'NEAU_01.js',
        importUrl: 'https://webvpn.neau.edu.cn/',
        maintainer: 'dezige131',
        description: '东北农业大学适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'NENU',
    name: '东北师范大学',
    initial: 'D',
    folder: 'NENU',
    adapters: [
      {
        id: 'NENU_01',
        name: '东北师范大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'NENU_01.js',
        importUrl: 'https://bkjx.nenu.edu.cn/',
        maintainer: 'dezige131',
        description: '东北师范大学适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'FOSU',
    name: '佛山大学',
    initial: 'F',
    folder: 'FOSU',
    adapters: [
      {
        id: 'FOSU_01',
        name: '佛山大学强智教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'fosu_01.js',
        importUrl: 'https://100.fosu.edu.cn/',
        maintainer: 'e7g',
        description: '佛山大学强智教务系统适配，支持课程表导入，需要校园网访问'
      }
    ]
  },
  {
    id: 'FJCPC',
    name: '福建船政交通职业学院',
    initial: 'F',
    folder: 'FJCPC',
    adapters: [
      {
        id: 'FJCPC',
        name: '福建船政交通职业学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'fjcpc.js',
        importUrl: 'https://webvpn.fjcpc.edu.cn/',
        maintainer: '星河欲转',
        description: '点击本校师生统一身份验证进行登录，登录后点击新教务系统在点击教务管理\n 已使用自动获取开学日期，免去手动设置 \n福建船政交通职业学院教务适配,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'FAFU',
    name: '福建农林大学',
    initial: 'F',
    folder: 'FAFU',
    adapters: [
      {
        id: 'FAFU_01',
        name: '福建农林大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'FAFU.js',
        importUrl: 'http://jwgl.fafu.edu.cn/',
        maintainer: 'Haooz',
        description: '基于正方教务 HTML 课表网格解析，登录后在个人课表查询页面点击执行导入'
      }
    ]
  },
  {
    id: 'FJNU',
    name: '福建师范大学',
    initial: 'F',
    folder: 'FJNU',
    adapters: [
      {
        id: 'FJNU_01',
        name: '福建师范大学研究生教务系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'fjnu_01.js',
        importUrl: 'https://gedu.fjnu.edu.cn/cas/login?service=https%3A%2F%2Fgedu.fjnu.edu.cn%2Findex',
        maintainer: 'Hui0069',
        description: '登录后进入课程表，选择目标学期并等待加载完成，再执行导入。导入课程及学校12节作息时间，学期开始日期和总周数需手动核对。支持连续节次、单双周和同一时段多门课程；自定时间课程需先在教务系统确认排课。'
      }
    ]
  },
  {
    id: 'FJPIT',
    name: '福建信息职业技术学院',
    initial: 'F',
    folder: 'FJPIT',
    adapters: [
      {
        id: 'FJPIT_01',
        name: '福建信息职业技术学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'fjpit_01.js',
        importUrl: 'https://jw.fjpit.com/#/auth/login',
        maintainer: 'Panda君',
        description: '登录完成后，直接点击“导入按钮”即可；龙腰校区实测可用，如有问题请提issues'
      }
    ]
  },
  {
    id: 'FIT',
    name: '福州理工学院',
    initial: 'F',
    folder: 'FIT',
    adapters: [
      {
        id: 'FIT',
        name: '福州理工学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'fit.js',
        importUrl: 'http://oaa.fitedu.net/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Haooz',
        description: '福州理工学院正方教务V9，进入教务系统后直接点击导入即可'
      }
    ]
  },
  {
    id: 'FVTI',
    name: '福州职业技术大学',
    initial: 'F',
    folder: 'FVTI',
    adapters: [
      {
        id: 'FVTI_01',
        name: '福州职业技术大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'fvti_01.js',
        importUrl: 'https://jw.webvpn.fvti.cn/Framework/lyssoNew/login.php',
        maintainer: 'Panda君',
        description: '登录教务系统后直接点导入即可；自动抓取周课表并导入课程、作息时间与开学日期，实测正常使用，如有问题请提issues。'
      }
    ]
  },
  {
    id: 'GSCMXY',
    name: '甘肃财贸职业学院',
    initial: 'G',
    folder: 'GSCMXY',
    adapters: [
      {
        id: 'GSCMXY_01',
        name: '甘肃财贸职业学院-金智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gscmxy.js',
        importUrl: 'https://jwxt.gscmxy.edu.cn/',
        maintainer: 'ShallowY',
        description: '甘肃财贸职业学院教务系统适配，统一身份认证后执行导入。'
      }
    ]
  },
  {
    id: 'GSMC',
    name: '甘肃医学院',
    initial: 'G',
    folder: 'GSMC',
    adapters: [
      {
        id: 'GSMC_01',
        name: '甘肃医学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gsmc_01.js',
        importUrl: 'https://jw.gsmc.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: '星河欲转',
        description: '甘肃医学院适配教务，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GDUT',
    name: '广东工业大学',
    initial: 'G',
    folder: 'GDUT',
    adapters: [
      {
        id: 'GDUT_01',
        name: '广东工业大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdut.js',
        importUrl: 'https://authserver.gdut.edu.cn/authserver/login?service=https%3A%2F%2Fjxfw.gdut.edu.cn%2Fnew%2FssoLogin',
        maintainer: 'forer4433',
        description: '广东工业大学教务系统课程导入适配。本校开发者适配，如有问题请提交issues。'
      }
    ]
  },
  {
    id: 'GDOU',
    name: '广东海洋大学',
    initial: 'G',
    folder: 'GDOU',
    adapters: [
      {
        id: 'GDOU_01',
        name: '广东海洋大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdou.js',
        importUrl: 'https://jw.gdou.edu.cn/',
        maintainer: 'Mccurtain',
        description: '广东海洋大学教务适配，校园网内优先使用此通道，如有误请提交 issues'
      },
      {
        id: 'GDOU_02',
        name: '广东海洋大学教务（校外通道）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdou2.js',
        importUrl: 'https://wfw.gdou.edu.cn/https://jw.gdou.edu.cn/',
        maintainer: 'Mccurtain',
        description: '广东海洋大学教务适配，校园网外使用（经学校零信任通道访问教务系统，校内外均可），登录前，请点右上角菜单，选择“电脑模式”。如有误请提交 issues'
      },
      {
        id: 'GDOUYJ_01',
        name: '广东海洋大学阳江校区教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdouyj.js',
        importUrl: 'https://wfw.gdou.edu.cn/https://jw.gdou.edu.cn/',
        maintainer: 'Yihe-ng',
        description: '使用阳江校区错峰作息。登录前，请点右上角菜单，选择“电脑模式”。如果登录后页面显示UI异常，直接点击“执行导入”导入课表，确认学年学期后，再点一次“导入”保存课程。如有误请提交 issues'
      },
      {
        id: 'GDOUYJ_02',
        name: '广东海洋大学阳江校区教务（备用通道）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdouyj2.js',
        importUrl: 'https://jxpj.gdou.edu.cn/wx/?universitycode=10566',
        maintainer: 'Yihe-ng，海大百事通',
        description: '广东海洋大学阳江校区教务适配，使用阳江校区教学楼错峰作息时间。教务系统不可用时的备用通道：改从教学评价系统获取，数据可能存在滞后、部分课程可能缺失，可手动补录'
      }
    ]
  },
  {
    id: 'GPNU',
    name: '广东技术师范大学',
    initial: 'G',
    folder: 'GPNU',
    adapters: [
      {
        id: 'GPNU_01',
        name: '广师大教务管理系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gpnu_01.js',
        importUrl: 'https://jwglxt.gpnu.edu.cn/sso/lyiotlogin',
        maintainer: 'moondish',
        description: '适配教务管理系统，登录后导入个人课表。如有bug请提交issues。泥鸡又赢了！'
      }
    ]
  },
  {
    id: 'GDCP',
    name: '广东交通职业技术学院',
    initial: 'G',
    folder: 'GDCP',
    adapters: [
      {
        id: 'GDCP_01',
        name: '广东交通职业技术学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdcp_01.js',
        importUrl: 'https://cas.gdcp.edu.cn/',
        maintainer: '小漫君',
        description: '登录融合门户并进入新教务系统后导入，选择学期与上课校区，按教学楼应用学校作息，并读取开学日期与总周数。'
      },
      {
        id: 'GDCP_02',
        name: '广东交通职业技术学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdcp_02.js',
        importUrl: 'https://jw.gdcp.edu.cn/',
        maintainer: 'Haooz',
        description: '登录教务系统后，选择学期后直接执行导入，按教学楼自动判定校区'
      }
    ]
  },
  {
    id: 'GDUST',
    name: '广东科技学院',
    initial: 'G',
    folder: 'GDUST',
    adapters: [
      {
        id: 'GDUST',
        name: '广东科技学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdust.js',
        importUrl: 'https://webvpn.gdust.edu.cn/https/77726476706e69737468656265737421f3f652d220347d436a468ca88d1b203b/cas/?service=https%3A%2F%2Fwebvpn.gdust.edu.cn%2Flogin%3Fcas_login%3Dtrue',
        maintainer: '星河欲转',
        description: '广东科技学院适配教务,登录后需要进入教务系统才可以点击导入,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GDKM',
    name: '广东科贸职业学院',
    initial: 'G',
    folder: 'GDKM',
    adapters: [
      {
        id: 'GDKM',
        name: '广东科贸职业学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'GDKM.js',
        importUrl: 'https://aic.gdkm.edu.cn/cas_server/login',
        maintainer: 'qwwshs',
        description: '广东科贸职业学院强智教务，非本校开发者适配如果有误建议提交issues喵'
      }
    ]
  },
  {
    id: 'GDIT',
    name: '广东科学技术职业学院',
    initial: 'G',
    folder: 'GDIT',
    adapters: [
      {
        id: 'GDIT_01',
        name: '广东科学技术职业学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdit.js',
        importUrl: 'https://ids.gdit.edu.cn/authserver/login?service=https://wbdt.gdit.edu.cn/shiro-cas',
        maintainer: 'Haooz',
        description: '广东科学技术职业学院网上办事大厅课程表导入适配。登录后进入课程表页面即可导入。'
      }
    ]
  },
  {
    id: 'GDIPU',
    name: '广东轻工职业技术大学',
    initial: 'G',
    folder: 'GDIPU',
    adapters: [
      {
        id: 'GDIPU_01',
        name: '广东轻工职业技术大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdipu.js',
        importUrl: 'https://jw.gdipu.edu.cn',
        maintainer: 'LittleArray',
        description: '广东轻工职业技术大学（南海北区）适配教务,适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GDPU',
    name: '广东药科大学',
    initial: 'G',
    folder: 'GDPU',
    adapters: [
      {
        id: 'GDPU_01',
        name: '广东药科大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gdpu_01.js',
        importUrl: 'https://webvpn.gdpu.edu.cn/https/77726476706e69737468656265737421f3f652d220347845300d8db9d6562d/lyuapServer/login?service=https%3A%2F%2Fjwsys.gdpu.edu.cn%2Fsso%2Flyiotlogin',
        maintainer: '星河欲转',
        description: '广东药科大学适配教务,支持多校区时间,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GXDLXY',
    name: '广西电力职业技术学院',
    initial: 'G',
    folder: 'GXDLXY',
    adapters: [
      {
        id: 'GXDLXY_01',
        name: '广西电力职业技术学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gxdlxy_01.js',
        importUrl: 'https://jw.gxdlxy.com/jsxsd/framework/xsMain.jsp',
        maintainer: '星河欲转',
        description: '广西电力职业技术学院强智教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GXCME',
    name: '广西机电职业技术学院',
    initial: 'G',
    folder: 'GXCME',
    adapters: [
      {
        id: 'GXCME',
        name: '广西机电职业技术学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gxcme.js',
        importUrl: 'https://sso.gxcme.edu.cn/login?service=https://nportal.gxcme.edu.cn/login',
        maintainer: 'Haooz',
        description: '广西机电职业技术学院正方教务V9（Mobile版API），进入课表页面后点击导入'
      }
    ]
  },
  {
    id: 'GXMU',
    name: '广西医科大学',
    initial: 'G',
    folder: 'GXMU',
    adapters: [
      {
        id: 'GXMU_01',
        name: '广西医科大学智慧教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gxmu.js',
        importUrl: 'https://cas.gxmu.edu.cn/lyuapServer/login',
        maintainer: 'Haooz',
        description: '广西医科大学智慧教务系统课表导入，登录门户站点以后，进入教务系统，直接点击导入即可'
      }
    ]
  },
  {
    id: 'GZMTU',
    name: '广州航海学院',
    initial: 'G',
    folder: 'GZMTU',
    adapters: [
      {
        id: 'GZMTU_01',
        name: '广州航海学院本科教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gzmtu.js',
        importUrl: 'http://jwx.gzmtu.edu.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N2151&layout=default',
        maintainer: 'weiwei221206',
        description: '适用于广州航海学院本科教务系统一键导入'
      }
    ]
  },
  {
    id: 'HUALIXY',
    name: '广州华立学院',
    initial: 'G',
    folder: 'HUALIXY',
    adapters: [
      {
        id: 'HUALIXY_01',
        name: '广州华立学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hualixy.js',
        importUrl: 'https://jw.hualixy.edu.cn/sso/ddlogin',
        maintainer: '小漫君',
        description: '广州华立学院正方新一代教务系统适配。请先通过统一认证(jw.hualixy.edu.cn/sso/ddlogin)或正方直登(jwglxt/xtgl/login_slogin.html)登录，在教务系统任意页面直接执行导入即可（无需进入课表查询页面）；脚本自动读取学年学期并获取课表与真实节次作息。'
      }
    ]
  },
  {
    id: 'GZIST',
    name: '广州理工学院',
    initial: 'G',
    folder: 'GZIST',
    adapters: [
      {
        id: 'GZIST_01',
        name: '广州理工学院（统一身份认证）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gzist_01.js',
        importUrl: 'https://ids.gzist.edu.cn/lyuapServer/login?service=http%3A%2F%2Fjw.gzist.edu.cn%2Fsso%2Flyiotlogin',
        maintainer: 'YT-O5',
        description: '输入统一认证门户账号密码后在信息查询页面进入学生课表查询，随后点击底部“执行导入”。'
      },
      {
        id: 'GZIST_02',
        name: '广州理工学院（WebVPN 校外）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gzist_01.js',
        importUrl: 'https://webvpn.gzist.edu.cn/login',
        maintainer: 'YT-O5',
        description: '提示：本系统是为非校园网用户提供访问校内资源的途径，如用户使用校园网上网时无需登录本系统。正常可使用统一身份认证通过相关账号密码登录。此项功能未进行测试。'
      }
    ]
  },
  {
    id: 'GZST',
    name: '广州松田职业学院',
    initial: 'G',
    folder: 'GZST',
    adapters: [
      {
        id: 'GZST',
        name: '广州松田职业学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gzst.js',
        importUrl: 'https://jw.educationgroup.cn/gzstzyxy_jsxsd/',
        maintainer: '星河欲转',
        description: '广州松田职业学院强智适配,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XHSYSU',
    name: '广州新华学院',
    initial: 'G',
    folder: 'XHSYSU',
    adapters: [
      {
        id: 'XHSYSU_01',
        name: '广州新华学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xhsysu.js',
        importUrl: 'https://xhcas.xhsysu.edu.cn/lyuapServer/login?service=https%3A%2F%2Fjw.xhsysu.edu.cn%2Fsso%2Flyiotlogin',
        maintainer: 'Haooz',
        description: '广州新华学院正方教务系统(V9)课表导入，登录教务系统任意页面后点击导入。非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'GZHMU',
    name: '广州医科大学',
    initial: 'G',
    folder: 'GZHMU',
    adapters: [
      {
        id: 'GZHMU_01',
        name: '广州医科大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gzhmu_01.js',
        importUrl: 'https://webvpn.gzhmu.edu.cn/',
        maintainer: '小漫君',
        description: '校外请先登录学校 WebVPN，进入教务系统后点击导入。没有教务入口时用快速跳转打开 https://jwgl.gzhmu.edu.cn/jsxsd/framework/xsMainV.htmlx。支持选择学期，采用教务处公布的 16 节作息，医院见习时间请另行核对。'
      }
    ]
  },
  {
    id: 'GZU',
    name: '贵州大学',
    initial: 'G',
    folder: 'GZU',
    adapters: [
      {
        id: 'GZU',
        name: '贵州大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gzu.js',
        importUrl: 'https://zhjw.gzu.edu.cn/jwglxt/xtgl/',
        maintainer: 'Daoguan-king',
        description: '贵州大学需要登录学校VPN，登录后需要进入教务系统“个人课表查询”页面再点击导入，最后特别致谢24级农学波波的帮助，没有他我VPN登录不了，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GZTCME',
    name: '贵州机电职业技术学院',
    initial: 'G',
    folder: 'GZTCME',
    adapters: [
      {
        id: 'GZTCME',
        name: '贵州机电职业技术学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gztcme.js',
        importUrl: 'https://jwxt.gztcme.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N2151&layout=default',
        maintainer: 'Panda君',
        description: '点开直达“个人课表查询”；未登录会先跳登录页，登录后回到后台首页直接点导入即可，不用再翻菜单。可选择学年学期，自动读取校历、校区作息与周次，未排定时间的课程会提示。'
      }
    ]
  },
  {
    id: 'GUIT',
    name: '桂林信息科技学院',
    initial: 'G',
    folder: 'GUIT',
    adapters: [
      {
        id: 'GUIT_01',
        name: '桂林信息科技学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'guit_01.js',
        importUrl: 'https://172-16-18-132.webvpn.guit.edu.cn',
        maintainer: 'Mercury',
        description: '桂林信息科技学院适配教务'
      }
    ]
  },
  {
    id: 'GLMU',
    name: '桂林医科大学',
    initial: 'G',
    folder: 'GLMU',
    adapters: [
      {
        id: 'GLMU_01',
        name: '桂林医科大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'glmu.js',
        importUrl: 'https://ejwc.glmu.edu.cn/',
        maintainer: 'xhh李',
        description: '桂林医科大学教务,本校开发者适配，如果有误请加入QQ频道：pd12631377'
      }
    ]
  },
  {
    id: 'HRBEU',
    name: '哈尔滨工程大学',
    initial: 'H',
    folder: 'HRBEU',
    adapters: [
      {
        id: 'HRBEU',
        name: '哈尔滨工程大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hrbeu.js',
        importUrl: 'https://jwgl.hrbeu.edu.cn/jwapp/sys/emaphome/portal/index.do',
        maintainer: 'penguinway',
        description: '哈尔滨工程大学金智教务(EMAP)适配，需校园网或WebVPN访问。登录后，切换到课表页面，点击导入即可。'
      },
      {
        id: 'HRBEU_YJS',
        name: '哈尔滨工程大学研究生系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'hrbeu_yjs.js',
        importUrl: 'https://yjs.hrbeu.edu.cn/',
        maintainer: 'penguinway',
        description: '哈尔滨工程大学研究生教育管理系统适配。登录后进入课表查询页面，等待课表加载完成后点击导入。'
      }
    ]
  },
  {
    id: 'HIT',
    name: '哈尔滨工业大学',
    initial: 'H',
    folder: 'HIT',
    adapters: [
      {
        id: 'HIT',
        name: '哈尔滨工业大学研究生系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'hit.js',
        importUrl: 'http://yjsgl-hit-edu-cn.ivpn.hit.edu.cn:1080/xs/index',
        maintainer: 'Haooz',
        description: '哈尔滨工业大学研究生教育管理系统，需通过VPN访问，登录后点击导入'
      }
    ]
  },
  {
    id: 'HFNU',
    name: '合肥师范学院',
    initial: 'H',
    folder: 'HFNU',
    adapters: [
      {
        id: 'HFNU_01',
        name: '合肥师范学院树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hfnu.js',
        importUrl: 'https://jw.hfnu.edu.cn/eams/loginExt.action',
        maintainer: '星河欲转',
        description: '合肥师范学院树维教务，支持双校区作息，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HBGUHX',
    name: '河北地质大学华信学院',
    initial: 'H',
    folder: 'HBGUHX',
    adapters: [
      {
        id: 'HBGUHX',
        name: '河北地质大学华信学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hbguhx_01.js',
        importUrl: 'http://61.182.88.214:8090',
        maintainer: '未来之乡',
        description: '河北地质大学华信学院强智教务,本校25届开发者适配如果有误请联系<上游作者联系方式>'
      }
    ]
  },
  {
    id: 'HBDFXY',
    name: '河北东方学院',
    initial: 'H',
    folder: 'HBDFXY',
    adapters: [
      {
        id: 'HBDFXY_01',
        name: '强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hbdfxy_01.js',
        importUrl: 'http://219.148.95.56:10000/jsxsd/',
        maintainer: '小漫君',
        description: '登录教务后导入，支持选择学期，自动读取教学周历并写入学校十节作息，课程按教务节次排课。无上课时间的课程会单独提示，不生成虚构安排。'
      }
    ]
  },
  {
    id: 'HEBEU',
    name: '河北工程大学',
    initial: 'H',
    folder: 'HEBEU',
    adapters: [
      {
        id: 'HEBEU_01',
        name: '河北工程大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hebeu.js',
        importUrl: 'https://jwglxxfwpt.hebeu.edu.cn/xtgl/login_slogin.html',
        maintainer: 'Nanawwa',
        description: '登录河北工程大学教务系统后即可导入课表，支持选择学年学期，自动获取开学日期、学期总周数与作息时间'
      }
    ]
  },
  {
    id: 'HUEB',
    name: '河北经贸大学',
    initial: 'H',
    folder: 'HUEB',
    adapters: [
      {
        id: 'HUEB',
        name: '河北经贸大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hueb.js',
        importUrl: 'https://202-206-194-100.vpn.hueb.edu.cn:8118/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Haooz',
        description: '河北经贸大学正方教务V9，需通过VPN访问，进入教务系统后点击导入'
      }
    ]
  },
  {
    id: 'HEBAU',
    name: '河北农业大学',
    initial: 'H',
    folder: 'HEBAU',
    adapters: [
      {
        id: 'HEBAU',
        name: '河北农业大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hebau.js',
        importUrl: 'http://urp.hebau.edu.cn:1009/jwapp/sys/homeapp/home/index.html#/',
        maintainer: 'Haooz',
        description: '河北农业大学课表导入，请先登录教务系统，再点击导入！非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'HUEL',
    name: '河南财经政法大学',
    initial: 'H',
    folder: 'HUEL',
    adapters: [
      {
        id: 'HUEL_01',
        name: '河南财经政法大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'huel_01.js',
        importUrl: 'https://xk.huel.edu.cn',
        maintainer: 'Mercury',
        description: '河南财经政法大学适配教务'
      }
    ]
  },
  {
    id: 'HUUC',
    name: '河南城建学院',
    initial: 'H',
    folder: 'HUUC',
    adapters: [
      {
        id: 'HUUC_01',
        name: '河南城建学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'huuc_01.js',
        importUrl: 'http://jwglxt.huuc.edu.cn:8061/admin/login',
        maintainer: '拉里',
        description: '河南城建学院本科超星教务适配。登录并打开个人课表后执行，支持选择学期和校区；尝试读取作息时间与开学日期。'
      }
    ]
  },
  {
    id: 'HAUE',
    name: '河南工程学院',
    initial: 'H',
    folder: 'HAUE',
    adapters: [
      {
        id: 'HAUE_01',
        name: '河南工程学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'haue_01.js',
        importUrl: 'http://106.system.haue.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: '拉里',
        description: '登录教务系统后开始导入，确认默认学期即可导入，也可更换学年、学期。自动获取课程和作息，并尝试获取开学日期及学期总周数；未排定时间或解析异常的课程会提示，请核对后保存。'
      }
    ]
  },
  {
    id: 'HAUT',
    name: '河南工业大学',
    initial: 'H',
    folder: 'HAUT',
    adapters: [
      {
        id: 'HAUT_01',
        name: '河南工业大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'haut_01.js',
        importUrl: 'https://jwglxt.haut.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: '星河欲转',
        description: '河南工业大学适配教务，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HAUST',
    name: '河南科技大学',
    initial: 'H',
    folder: 'HAUST',
    adapters: [
      {
        id: 'HAUST',
        name: '河南科技大学树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'haust.js',
        importUrl: 'https://vpn.haust.edu.cn',
        maintainer: 'Haooz',
        description: '河南科技大学新版树维教务，需通过VPN访问，登录后进入课表页面点击导入'
      }
    ]
  },
  {
    id: 'HIST',
    name: '河南科技学院',
    initial: 'H',
    folder: 'HIST',
    adapters: [
      {
        id: 'HIST_01',
        name: '河南科技学院适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hist_01.js',
        importUrl: 'http://jwgl.hist.edu.cn/cas/login.action',
        maintainer: 'zixij644-elaborate',
        description: '河南科技学院(青果/KINGOSOFT教务)课表导入,自动按所选学年学期获取教务公布作息,失败回退内置备用作息'
      }
    ]
  },
  {
    id: 'HPU',
    name: '河南理工大学',
    initial: 'H',
    folder: 'HPU',
    adapters: [
      {
        id: 'HPU_01',
        name: '河南理工大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hpu.js',
        importUrl: 'https://zhjw.hpu.edu.cn/eams/login.action',
        maintainer: 'ca1q1an',
        description: '河南理工大学树维教务系统(eams架构)，统一身份认证CAS登录\n导入后请在App中设置本学期开学日期'
      }
    ]
  },
  {
    id: 'HNSF',
    name: '河南师范大学',
    initial: 'H',
    folder: 'HNSF',
    adapters: [
      {
        id: 'HNSF_01',
        name: '河南师范大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnsf_01.js',
        importUrl: 'https://jwc.htu.edu.cn/',
        maintainer: '星河欲转',
        description: '河南师范大学适配教务,添加双季作息,非本校开发者适配如果有误建议提交issues'
      },
      {
        id: 'HNSF_02',
        name: '河南师范大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnsf_02.js',
        importUrl: 'https://jwc.htu.edu.cn/',
        maintainer: '一颗',
        description: '该作者没有添加说明'
      }
    ]
  },
  {
    id: 'HIIT',
    name: '河南信息科技学院',
    initial: 'H',
    folder: 'HIIT',
    adapters: [
      {
        id: 'HIIT_01',
        name: '河南信息科技学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hiit_01.js',
        importUrl: 'http://39.164.230.243:9527/#/authserver/login?redirect_uri=aHR0cDovLzM5LjE2NC4yMzAuMjQzOjkxL2VhbXMvbG9naW4uYWN0aW9u',
        maintainer: 'Mercury',
        description: '河南信息科技学院适配教务。登陆后点击导入即可，无视界面异常显示问题。'
      }
    ]
  },
  {
    id: 'HNZY',
    name: '河南职业技术学院',
    initial: 'H',
    folder: 'HNZY',
    adapters: [
      {
        id: 'HNZY_01',
        name: '河南职业技术学院课表',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnzy.js',
        importUrl: 'https://one.hnzj.edu.cn/common-service/kcb-pc/personage/personage',
        maintainer: '一颗',
        description: ''
      }
    ]
  },
  {
    id: 'HZU',
    name: '菏泽学院',
    initial: 'H',
    folder: 'HZU',
    adapters: [
      {
        id: 'HZU',
        name: '菏泽学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hzu.js',
        importUrl: 'https://222.206.176.102/jsxsd/',
        maintainer: 'yukoimi',
        description: '登录后即可导入学期理论课表，支持学期选择、单双周、单节课、教学周历及冬夏季作息自动切换（5月1日夏季、10月5日冬季）。'
      }
    ]
  },
  {
    id: 'HLJU',
    name: '黑龙江大学',
    initial: 'H',
    folder: 'HLJU',
    adapters: [
      {
        id: 'HLJU',
        name: '黑龙江大学研究生教育综合管理系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'hlju.js',
        importUrl: 'https://yjsglxt.hlju.edu.cn/',
        maintainer: 'lixu-030506',
        description: '黑龙江大学研究生教育综合管理信息系统课表适配。登录教务系统并查询当前学期课表后即可导入。'
      },
      {
        id: 'HLJU_BACHELOR',
        name: '黑龙江大学本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hlju_bachelor.js',
        importUrl: 'http://xsxk.hlju.edu.cn/',
        maintainer: 'Haooz',
        description: '黑龙江大学本科教务系统课表导入，请先登录，再点击导入！'
      }
    ]
  },
  {
    id: 'HYNU',
    name: '衡阳师范学院',
    initial: 'H',
    folder: 'HYNU',
    adapters: [
      {
        id: 'HYNU_01',
        name: '衡阳师范学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hynu_01.js',
        importUrl: 'https://hysfjw.hynu.edu.cn/jsxsd/',
        maintainer: '星河欲转',
        description: '衡阳师范学院强智适配,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'IMNC',
    name: '呼和浩特民族学院',
    initial: 'H',
    folder: 'IMNC',
    adapters: [
      {
        id: 'IMNC_01',
        name: '通过 WebVPN 登录',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'imnc_01.js',
        importUrl: 'https://webvpn.imnc.edu.cn',
        maintainer: '浮笙-WindDrift',
        description: '无需校园网，使用 WebVPN 登录，登录后依次点击【教务管理系统】-【本学期课表】，在“本学期课程安排”页面点击【执行导入】。'
      },
      {
        id: 'IMNC_02',
        name: '已连接校园网？',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'imnc_01.js',
        importUrl: 'http://211.82.176.48/academic/login/imnc/loginIds6.jsp',
        maintainer: '浮笙-WindDrift',
        description: '需要校园网，适用于上方无法登录的情况，登录后依次点击【教务管理系统】-【本学期课表】，在“本学期课程安排”页面点击【执行导入】。'
      }
    ]
  },
  {
    id: 'HBMZU',
    name: '湖北民族大学',
    initial: 'H',
    folder: 'HBMZU',
    adapters: [
      {
        id: 'HBMZU',
        name: '湖北民族大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hbmzu.js',
        importUrl: 'https://jwgl.hbmzu.edu.cn/edu/',
        maintainer: 'Haooz',
        description: '湖北民族大学教务系统课表导入，请先登录并打开课表查询页面，再点击导入！'
      }
    ]
  },
  {
    id: 'HUAT',
    name: '湖北汽车工业学院',
    initial: 'H',
    folder: 'HUAT',
    adapters: [
      {
        id: 'HUAT',
        name: '湖北汽车工业学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'HUAT.js',
        importUrl: 'https://cas.huat.edu.cn/authserver/login?service=http%3A%2F%2Fneweas.huat.edu.cn%2Flogin',
        maintainer: '老考滤一下',
        description: '湖北汽车工业学院适配教务'
      }
    ]
  },
  {
    id: 'HBUAS',
    name: '湖北文理学院',
    initial: 'H',
    folder: 'HBUAS',
    adapters: [
      {
        id: 'HBUAS_01',
        name: '湖北文理学院超星教务适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hbuas_01.js',
        importUrl: 'https://hbuas.jw.chaoxing.com/admin/login',
        maintainer: 'salt-fishes',
        description: '湖北文理学院超星教务适配，自动识别当前学期与校区，自动导入课程、作息时间与开学日期，支持账密登录与学习通扫码登录'
      }
    ]
  },
  {
    id: 'HBMU',
    name: '湖北医药学院',
    initial: 'H',
    folder: 'HBMU',
    adapters: [
      {
        id: 'HBMU_01',
        name: '湖北医药学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hbmu.js',
        importUrl: 'https://jw.hbmu.edu.cn/',
        maintainer: 'xhh李',
        description: '湖北医药学院教务,由桂医开发者适配，如果有误请加入QQ频道：pd12631377'
      }
    ]
  },
  {
    id: 'HNU',
    name: '湖南大学',
    initial: 'H',
    folder: 'HNU',
    adapters: [
      {
        id: 'HNU_01',
        name: '湖南大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnu_01.js',
        importUrl: 'http://hdjw.hnu.edu.cn/jsxsd/sso.jsp',
        maintainer: '星河欲转',
        description: '湖南大学强智教务适配，支持获取开学日期,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HNIE',
    name: '湖南工程学院',
    initial: 'H',
    folder: 'HNIE',
    adapters: [
      {
        id: 'hnie_01',
        name: '湖南工程学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnie_01.js',
        importUrl: 'http://jwcmis.hnie.edu.cn',
        maintainer: 'Mercury',
        description: '湖南工程学院适配教务。'
      }
    ]
  },
  {
    id: 'HNUST',
    name: '湖南科技大学',
    initial: 'H',
    folder: 'HNUST',
    adapters: [
      {
        id: 'HNUST_01',
        name: '湖南科技大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'HNUST_01.js',
        importUrl: 'https://kdjw.hnust.edu.cn/',
        maintainer: 'dezige131',
        description: '湖南科技大学适配教务,请使用企业微信登录'
      }
    ]
  },
  {
    id: 'HUSE',
    name: '湖南科技学院',
    initial: 'H',
    folder: 'HUSE',
    adapters: [
      {
        id: 'HUSE',
        name: '湖南科技学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'HUSE.js',
        importUrl: 'http://jw.huse.cn/jsxsd',
        maintainer: 'KevinZ',
        description: '湖南科技学院适配教务,如有错误请联系作者QQ:2865467965'
      }
    ]
  },
  {
    id: 'HUNAU',
    name: '湖南农业大学',
    initial: 'H',
    folder: 'HUNAU',
    adapters: [
      {
        id: 'HUNAU_01',
        name: '湖南农业大学（强智教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hunau_01.js',
        importUrl: 'https://webvpn.hunau.edu.cn/login?cas_login=true',
        maintainer: 'salt-fishes',
        description: '登录湖南农业大学教务系统后即可导入课表（校外经 WebVPN 访问）'
      }
    ]
  },
  {
    id: 'SANYEDU',
    name: '湖南三一工业职业技术学院',
    initial: 'H',
    folder: 'SANYEDU',
    adapters: [
      {
        id: 'SANYEDU',
        name: '湖南三一工业职业技术学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sany.js',
        importUrl: 'https://ehall.sanyedu.com/new/index.html',
        maintainer: 'Haooz',
        description: '湖南三一工业职业技术学院课表导入，请先登录并打开个人课表页面，再点击导入！'
      }
    ]
  },
  {
    id: 'HNVCC',
    name: '湖南商务职业技术学院',
    initial: 'H',
    folder: 'HNVCC',
    adapters: [
      {
        id: 'HNVCC_01',
        name: '湖南商务职业技术学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'HNVCC_01.js',
        importUrl: 'http://jwxt.hnvcc.edu.cn/',
        maintainer: '星河欲转',
        description: '湖南商务职业技术学院强智适配,添加双季作息,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HUNNU',
    name: '湖南师范大学',
    initial: 'H',
    folder: 'HUNNU',
    adapters: [
      {
        id: 'HUNNU',
        name: '湖南师范大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hunnu.js',
        importUrl: 'https://jwglnew.hunnu.edu.cn/eams/courseTableForStd.action',
        maintainer: 'EarOfWheat',
        description: '适配湖南师范大学教务系统，登录后进入课表页面(homeExt.action)，点击导入即可使用'
      }
    ]
  },
  {
    id: 'HNIU',
    name: '湖南信息职业技术学院',
    initial: 'H',
    folder: 'HNIU',
    adapters: [
      {
        id: 'HNIU_01',
        name: '湖南信息职业技术学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hniu_01.js',
        importUrl: 'https://authserver.hniu.cn/authserver/login?service=https%3A%2F%2Fehall.hniu.cn%3A443%2Flogin%3Fservice%3Dhttps%3A%2F%2Fehall.hniu.cn%2Fnew%2Findex.html%3Fbrowser%3Dno%25EF%25BC%2589#StudentAffairsA',
        maintainer: '星河欲转',
        description: '湖南信息职业技术学院强智适配，登录后需要点击进入教务系统才可以点开始导入，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HNPTC',
    name: '湖南邮电职业技术学院',
    initial: 'H',
    folder: 'HNPTC',
    adapters: [
      {
        id: 'HNPTC_01',
        name: '湘邮教学管理平台',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnptc_01.js',
        importUrl: 'http://jx.hnxyjf.com:10081/jsxsd/',
        maintainer: '小漫君',
        description: '登录湘邮教学管理平台学生端后选择学期导入，读取整学期课表与教学周历。作息时间参考学校 2025-2026 学年校历，请按最新安排核对。'
      }
    ]
  },
  {
    id: 'ECJTU',
    name: '华东交通大学',
    initial: 'H',
    folder: 'ECJTU',
    adapters: [
      {
        id: 'ECJTU_01',
        name: '华东交通大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ecjtu_01.js',
        importUrl: 'https://jwxt.ecjtu.edu.cn/index.action',
        maintainer: 'glxgo',
        description: '华东交通大学教务,登录后需要进入教务系统才可以点击导入,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SCUT',
    name: '华南理工大学',
    initial: 'H',
    folder: 'SCUT',
    adapters: [
      {
        id: 'SCUT_01',
        name: '华南理工大学webvpn适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'SCUT_01.js',
        importUrl: 'https://xsjw2018-jw.webvpn.scut.edu.cn/',
        maintainer: 'dezige131',
        description: '华南理工大学适配教务,非本校开发者适配如果有误建议提交issues'
      },
      {
        id: 'SCUT_02',
        name: '华南理工大学内网适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'SCUT_01.js',
        importUrl: 'http://xsjw2018.jw.scut.edu.cn/',
        maintainer: 'dezige131',
        description: '华南理工大学适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SCNU',
    name: '华南师范大学',
    initial: 'H',
    folder: 'SCNU',
    adapters: [
      {
        id: 'SCNU_01',
        name: '华南师范大学本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'scnu.js',
        importUrl: 'https://jwxt.scnu.edu.cn/xtgl/login_slogin.html',
        maintainer: 'YewFence',
        description: '登录后停留在教务系统任意页面即可导入，学年学期弹窗确认（默认当前学期）；按校区获取作息，自动识别开学日期与总周数。独立实验预约安排需另行核对。'
      }
    ]
  },
  {
    id: 'HQU',
    name: '华侨大学',
    initial: 'H',
    folder: 'HQU',
    adapters: [
      {
        id: 'HQU',
        name: '华侨大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hquadap.js',
        importUrl: 'https://atrust.hqu.edu.cn/portal/?redirectid=0.6668972084789097#/login',
        maintainer: 'Xuan-Xuann',
        description: '适配华侨大学。登录成功后选择个人课表查询，进入后等待加载完毕即可导入。'
      }
    ]
  },
  {
    id: 'HUST',
    name: '华中科技大学',
    initial: 'H',
    folder: 'HUST',
    adapters: [
      {
        id: 'HUST_01',
        name: '华中科技大学 HUB 系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hust.js',
        importUrl: 'http://mhub.hust.edu.cn',
        maintainer: 'Lucas04-nhr',
        description: '登录华中科技大学 HUB 系统后执行导入，可在近 6 年的春季、秋季学期之间切换。课程导入后请根据学校校历设置准确的开学日期。'
      }
    ]
  },
  {
    id: 'HHTC',
    name: '怀化学院',
    initial: 'H',
    folder: 'HHTC',
    adapters: [
      {
        id: 'HHTC_01',
        name: '怀化学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hhtc.js',
        importUrl: 'https://jwmis.hhtc.edu.cn/',
        maintainer: '星河欲转',
        description: '怀化学院强智教务，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HHVTC',
    name: '怀化职业技术学院',
    initial: 'H',
    folder: 'HHVTC',
    adapters: [
      {
        id: 'HHVTC',
        name: '怀化职业技术学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hhvt.js',
        importUrl: 'http://jwgl.hhvtc.com.cn/',
        maintainer: 'Haooz',
        description: '怀化职业技术学院青果教务课表导入，请先登录并打开课表查询页面，再点击导入！'
      }
    ]
  },
  {
    id: 'HBLGXY',
    name: '淮北理工学院',
    initial: 'H',
    folder: 'HBLGXY',
    adapters: [
      {
        id: 'HBLGXY_01',
        name: '淮北理工学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hblgxy_01.js',
        importUrl: 'https://a.hblgxy.edu.cn:5111/jsxsd/',
        maintainer: '星河欲转',
        description: '淮北理工学院强智适配，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HNNU',
    name: '淮南师范学院',
    initial: 'H',
    folder: 'HNNU',
    adapters: [
      {
        id: 'HNNU_01',
        name: '淮南师范学院库表图门户',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'hnnu_01.js',
        importUrl: 'https://xxmh.hnnu.edu.cn/zhxy/',
        maintainer: 'Haooz',
        description: '适配淮南师范学院库表图融合门户，登入后直接执行导入'
      }
    ]
  },
  {
    id: 'GUC',
    name: '吉利学院',
    initial: 'J',
    folder: 'GUC',
    adapters: [
      {
        id: 'GUC',
        name: '吉利学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'guc.js',
        importUrl: 'https://jw.guc.edu.cn/yethan/UserAction?setAction=userLogin',
        maintainer: 'Selffox',
        description: '吉利学院（Geely University of China）YETHAN以专教务系统，登录含图片验证码，需在页面内手动登录后导入'
      }
    ]
  },
  {
    id: 'JLU',
    name: '吉林大学',
    initial: 'J',
    folder: 'JLU',
    adapters: [
      {
        id: 'JLU_01',
        name: '吉林大学（新）教务管理系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'JLU_01.js',
        importUrl: 'https://iedu.jlu.edu.cn/',
        maintainer: 'Leimeng52mc',
        description: '直接打开 iedu.jlu.edu.cn 登录（统一身份认证），进入(新)教务管理系统后定位到我的课表页面，点击导出按钮即可导出课表数据。\n校内、校外均可直接访问，推荐优先使用。若该地址在你的网络下打不开，请改用本页的 WebVPN 入口。'
      },
      {
        id: 'JLU_02',
        name: '吉林大学（新）教务管理系统 (WebVPN)',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'JLU_01.js',
        importUrl: 'https://vpn.jlu.edu.cn/login',
        maintainer: 'Leimeng52mc',
        description: '网页版 VPN（WebVPN）入口，与直连入口共用同一份适配脚本。登录 WebVPN 后打开(新)教务管理系统，定位到我的课表页面，点击导出按钮即可导出课表数据。\n该入口通常仅在校外网络可用（校内访问异常），校内请使用直连入口。'
      }
    ]
  },
  {
    id: 'UJN',
    name: '济南大学',
    initial: 'J',
    folder: 'UJN',
    adapters: [
      {
        id: 'UJN_01',
        name: '济南大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'school.js',
        importUrl: 'https://sso.ujn.edu.cn/tpass/login?service=http%3A%2F%2Fjwgl.ujn.edu.cn%2Fsso%2Fdriotlogin',
        maintainer: 'Moyu',
        description: '济南大学教务系统适配，支持班级课表和个人课表的导入，通过统一认证登录'
      }
    ]
  },
  {
    id: 'JNMC',
    name: '济宁医学院',
    initial: 'J',
    folder: 'JNMC',
    adapters: [
      {
        id: 'JNMC_01',
        name: '济宁医学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jnmc.js',
        importUrl: 'http://210.44.16.13/',
        maintainer: 'yukoimi',
        description: '济宁医学院乘方教务适配，请先登录教务系统后再执行导入'
      }
    ]
  },
  {
    id: 'JYVTC',
    name: '济源职业技术学院',
    initial: 'J',
    folder: 'JYVTC',
    adapters: [
      {
        id: 'JYVTC_01',
        name: '济源职业技术学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jyvtc.js',
        importUrl: 'https://jwgl.jyvtc.edu.cn/jyvtcjw/',
        maintainer: '星河欲转',
        description: '济源职业技术学院适配教务,添加双季作息,非本校开发者适配如果有误建议提交issue'
      }
    ]
  },
  {
    id: 'JNU',
    name: '暨南大学',
    initial: 'J',
    folder: 'JNU',
    adapters: [
      {
        id: 'JNU_01',
        name: '暨南大学金智教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jnu_01.js',
        importUrl: 'https://jw.jnu.edu.cn',
        maintainer: 'White-Dew-Boy',
        description: '登录教务系统后进入我的课表界面。自动导入上课时间段仅适用于珠海校区，其它校区可自行配置'
      }
    ]
  },
  {
    id: 'UJS',
    name: '江苏大学',
    initial: 'J',
    folder: 'UJS',
    adapters: [
      {
        id: 'UJS_01',
        name: '江苏大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ujs_zhengfang_v9.0.js',
        importUrl: 'https://jwxt.ujs.edu.cn/sso/jziotlogin',
        maintainer: '洛初 Github@gongfuture',
        description: '江苏大学教务系统适配，仅支持个人课表的导入，通过统一身份认证登录  ver.3'
      },
      {
        id: 'UJS_02',
        name: '江苏大学研究生管理系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'ujs_yjs_v1.0.js',
        importUrl: 'http://yjsgll.ujs.edu.cn/pyxx/',
        maintainer: '洛初 Github@gongfuture',
        description: '江苏大学研究生管理系统适配，仅支持个人课表的导入，通过统一身份认证登录  ver.2'
      }
    ]
  },
  {
    id: 'JSEI',
    name: '江苏电子信息职业学院',
    initial: 'J',
    folder: 'JSEI',
    adapters: [
      {
        id: 'JSEI_01',
        name: '江苏电子信息职业学院（webvpn）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jsei_01.js',
        importUrl: 'https://webvpn.jsei.edu.cn/',
        maintainer: '星河欲转',
        description: '江苏电子信息职业学院正方教务，登录后进入教务系统点击开始导入，支持自动获取开学日期，非本校开发者适配如果有误建议提交issue'
      },
      {
        id: 'JSEI_02',
        name: '江苏电子信息职业学院（校园网）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jsei_01.js',
        importUrl: 'https://ehall.jsei.edu.cn/new/index.html',
        maintainer: '星河欲转',
        description: '江苏电子信息职业学院正方教务，统一身份认证入口，登录后进入教务系统点击开始导入，支持自动获取开学日期，非本校开发者适配如果有误建议提交issue'
      }
    ]
  },
  {
    id: 'JUST',
    name: '江苏科技大学',
    initial: 'J',
    folder: 'JUST',
    adapters: [
      {
        id: 'JUST',
        name: '江苏科技大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'just.js',
        importUrl: 'https://my.just.edu.cn/',
        maintainer: 'abyss-stars',
        description: '江苏科技大学正方新一代教务（jwglxt）。入口为官方信息门户（my.just.edu.cn）：统一身份认证登录后进入教务系统，在「信息查询-学生课表查询」页面执行导入；校外由门户自动代理，无需手动记 WebVPN 地址。脚本读取页面上的学年（.xnm）/学期（.xqm）下拉供确认，再自动获取个人课表、校区节次作息与开学日期。'
      }
    ]
  },
  {
    id: 'JSTC',
    name: '江苏旅游职业学院',
    initial: 'J',
    folder: 'JSTC',
    adapters: [
      {
        id: 'JSTC_01',
        name: '江苏旅游职业学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jstc_01.js',
        importUrl: 'https://authserver.jstc.edu.cn/authserver/login?service=https%3A%2F%2Fjwxt.jstc.edu.cn%2Fstudent%2Fsso%2Flogin',
        maintainer: '星河欲转',
        description: '江苏旅游职业学院教务，进入教务系统页面即可开始导入，支持自动获取开学日期，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'JSNU',
    name: '江苏师范大学',
    initial: 'J',
    folder: 'JSNU',
    adapters: [
      {
        id: 'JSNU_01',
        name: '江苏师范大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'JSNU_01.js',
        importUrl: 'https://i.jsnu.edu.cn/home',
        maintainer: 'dezige131',
        description: '江苏师范大学适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'JXFU',
    name: '江西飞行学院',
    initial: 'J',
    folder: 'JXFU',
    adapters: [
      {
        id: 'JXFU_01',
        name: '江西飞行学院适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'JXFU_01.js',
        importUrl: 'https://jwxt.jxfu.edu.cn/',
        maintainer: 'dezige131',
        description: '江西飞行学院适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'JHZYEDU',
    name: '江西航空职业技术学院',
    initial: 'J',
    folder: 'JHZYEDU',
    adapters: [
      {
        id: 'JHZYEDU_01',
        name: '正方教务-江西航空职业技术学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zhengfang.js',
        importUrl: 'https://jw.jhzyedu.cn/xtgl/login_slogin.html?ydType=0',
        maintainer: 'JN',
        description: '江西航空职业技术学院正方教务V9.0 API导入。登录教务系统后即可一键导入，自动获取课表及作息时间。'
      }
    ]
  },
  {
    id: 'JXUST',
    name: '江西理工大学',
    initial: 'J',
    folder: 'JXUST',
    adapters: [
      {
        id: 'JXUST',
        name: '江西理工大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jxust.js',
        importUrl: 'https://authserver.jxust.edu.cn/authserver/login?service=https://jw.jxust.edu.cn/jsxsd/',
        maintainer: '星河欲转',
        description: '江西理工大学强智教务适配\n非本校开发者适配,如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'JXNU',
    name: '江西师范大学',
    initial: 'J',
    folder: 'JXNU',
    adapters: [
      {
        id: 'JXNU',
        name: '江西师大教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'JXNU.js',
        importUrl: 'https://jwc.jxnu.edu.cn/',
        maintainer: 'glxgo',
        description: '本校学生适配，登录教务在线后，点击导入'
      }
    ]
  },
  {
    id: 'JDZVUA',
    name: '景德镇艺术职业大学',
    initial: 'J',
    folder: 'JDZVUA',
    adapters: [
      {
        id: 'JDZVUA',
        name: '景德镇艺术职业大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'jdzvua.js',
        importUrl: 'https://jwc.jdzvua.edu.cn/',
        maintainer: 'Haooz',
        description: '景德镇艺术职业大学课表导入，请先在页面上切换到要导入的学期课表，再点击导入！非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'KSU',
    name: '喀什大学',
    initial: 'K',
    folder: 'KSU',
    adapters: [
      {
        id: 'KSU_01',
        name: '喀什大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ksu_01.js',
        importUrl: 'https://cas.ksu.edu.cn/cas/login?service=https://jwnet.ksu.edu.cn/sso/ddlogin',
        maintainer: '星河欲转',
        description: '喀什大学适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'LZU',
    name: '兰州大学',
    initial: 'L',
    folder: 'LZU',
    adapters: [
      {
        id: 'LZU_01',
        name: '兰州大学本科生教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'lzu.js',
        importUrl: 'http://jwk.lzu.edu.cn/academic/common/security/login.jsp',
        maintainer: 'yalerove',
        description: '兰州大学本科生教务。登录后在【学生课表】(网格/列表视图均可)点击执行导入，自带兰大作息时间'
      }
    ]
  },
  {
    id: 'LUT',
    name: '兰州理工大学',
    initial: 'L',
    folder: 'LUT',
    adapters: [
      {
        id: 'LUT',
        name: '兰州理工大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'LUT.js',
        importUrl: 'https://jwxt.lut.edu.cn/',
        maintainer: 'Colton',
        description: '兰州理工大学教务适配, 登录后点击【我的课表】，获取课程'
      }
    ]
  },
  {
    id: 'LNU',
    name: '辽宁大学',
    initial: 'L',
    folder: 'LNU',
    adapters: [
      {
        id: 'LNU_01',
        name: '辽宁大学URP教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'LNU_01.js',
        importUrl: 'http://jwstudent.lnu.edu.cn/',
        maintainer: '739C1AE2',
        description: '辽宁大学URP教务适配'
      }
    ]
  },
  {
    id: 'USTL',
    name: '辽宁科技大学',
    initial: 'L',
    folder: 'USTL',
    adapters: [
      {
        id: 'USTL',
        name: '辽宁科技大学综合教务管理系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ustl.js',
        importUrl: 'https://ustl.jw.chaoxing.com/admin/login',
        maintainer: 'Cure',
        description: '辽宁科技大学适配教务, 登陆后点击【信息查询】, 再点击【我的课表】, 最后点击【执行导入】即可,本校毕业生适配, 如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'LCUDCC',
    name: '聊城大学东昌学院',
    initial: 'L',
    folder: 'LCUDCC',
    adapters: [
      {
        id: 'LCUDCC',
        name: '聊城大学东昌学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'lcudcc.js',
        importUrl: 'https://jw.lcudcc.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Haooz',
        description: '聊城大学东昌学院正方教务V9，进入教务系统后点击导入'
      }
    ]
  },
  {
    id: 'LYU',
    name: '临沂大学',
    initial: 'L',
    folder: 'LYU',
    adapters: [
      {
        id: 'LYU',
        name: '临沂大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'lyu.js',
        importUrl: 'https://sdp.lyu.edu.cn/https/webvpn3146b55e2aeee09087ebc4ebe6dbd770/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Haooz',
        description: '临沂大学正方教务V9，需通过webvpn访问，登录后进入课表页面点击导入'
      }
    ]
  },
  {
    id: 'LIT',
    name: '洛阳理工学院',
    initial: 'L',
    folder: 'LIT',
    adapters: [
      {
        id: 'LIT_01',
        name: '洛阳理工学院乘方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'lit_01.js',
        importUrl: 'https://lljw.lit.edu.cn/',
        maintainer: '小漫君',
        description: '洛阳理工学院乘方教务适配，请先登录教务系统后再执行导入'
      }
    ]
  },
  {
    id: 'MASU',
    name: '马鞍山学院',
    initial: 'M',
    folder: 'MASU',
    adapters: [
      {
        id: 'MASU_01',
        name: '马鞍山学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'masu.js',
        importUrl: 'https://jwxt.masu.edu.cn/',
        maintainer: 'Haooz',
        description: '马鞍山学院教务系统课表导入，登录后进入“”我的课表”页面，再点击导入！'
      }
    ]
  },
  {
    id: 'MMPT',
    name: '茂名职业技术学院',
    initial: 'M',
    folder: 'MMPT',
    adapters: [
      {
        id: 'MMPT',
        name: '茂名职业技术学院课表',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'mmpt.js',
        importUrl: 'https://jwc.mmpt.edu.cn/xtgl/login_slogin.html',
        maintainer: '一颗',
        description: '如果导入失败，请前往适配器仓库提交 issue 或 PR 以更新适配器。'
      }
    ]
  },
  {
    id: 'MYSY',
    name: '绵阳师范学院',
    initial: 'M',
    folder: 'MYSY',
    adapters: [
      {
        id: 'MYSY',
        name: '绵阳师范学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'mysy.js',
        importUrl: 'http://jw.mtc.edu.cn/',
        maintainer: 'Guzheng3',
        description: '登录教务系统后，在个人课表页面一键导入课表，自动附带上课时间。'
      }
    ]
  },
  {
    id: 'MKU',
    name: '闽南科技学院',
    initial: 'M',
    folder: 'MKU',
    adapters: [
      {
        id: 'MKU_01',
        name: '闽南科技学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'mku.js',
        importUrl: 'https://jwgl.mku.edu.cn/',
        maintainer: 'Mutx163',
        description: '适配闽南科技学院强智教务系统（新版 layui UI）。登录教务系统后运行，可选学期导入"学期理论课表"，自动附带节次时间模板与学期配置（当前学期自动识别开学日期，历史学期请在 App 内自行设置）。'
      }
    ]
  },
  {
    id: 'NCHU',
    name: '南昌航空大学',
    initial: 'N',
    folder: 'NCHU',
    adapters: [
      {
        id: 'NCHU_01',
        name: '南昌航空大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nchu.js',
        importUrl: 'http://jwc-publish2.jwc.nchu.edu.cn/',
        maintainer: 'Haooz',
        description: '南昌航空大学强智教务系统课表导入（需要校园网访问），进入课表查询界面以后，先点击查询所有全部周，再执行导入'
      }
    ]
  },
  {
    id: 'STCNCHU',
    name: '南昌航空大学科技学院',
    initial: 'N',
    folder: 'STCNCHU',
    adapters: [
      {
        id: 'STCNCHU',
        name: '南昌航空大学科技学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'stcnchu.js',
        importUrl: 'http://qzjwxt.stcnchu.edu.cn:800/jsxsd/',
        maintainer: '星河欲转',
        description: '南昌航空大学科技学院强智教务，需要内网或者vpn，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'THDM',
    name: '南昌科技职业大学',
    initial: 'N',
    folder: 'THDM',
    adapters: [
      {
        id: 'THDM_01',
        name: '南昌科技职业大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'THDM_01.js',
        importUrl: 'http://jw.tellhowedu.com:19995/',
        maintainer: 'HOLLOWDREAM',
        description: '联奕科技教务系统（南昌科技职业大学）'
      }
    ]
  },
  {
    id: 'SUSTECH',
    name: '南方科技大学',
    initial: 'N',
    folder: 'SUSTECH',
    adapters: [
      {
        id: 'SUSTECH',
        name: '南方科技大学教学管理与服务平台',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sustech.js',
        importUrl: 'https://cas.sustech.edu.cn/cas/login?service=https%3A%2F%2Ftis.sustech.edu.cn%2Fcas',
        maintainer: 'yusancky',
        description: '南方科技大学 TIS 教学管理与服务平台（tis.sustech.edu.cn），需先通过 CAS 登录，登录后可直接导入；移动端需切换为电脑模式访问教务系统'
      }
    ]
  },
  {
    id: 'SMU',
    name: '南方医科大学',
    initial: 'N',
    folder: 'SMU',
    adapters: [
      {
        id: 'SMU',
        name: '南方医科大学乘方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'smu_01.js',
        importUrl: 'https://zhjw.smu.edu.cn',
        maintainer: 'NekoJackie',
        description: '南方医科大学乘方教务，登录后进入教务系统执行导入，支持校本部与顺德校区作息，支持自动获取开学日期'
      }
    ]
  },
  {
    id: 'USC',
    name: '南华大学',
    initial: 'N',
    folder: 'USC',
    adapters: [
      {
        id: 'USC_01',
        name: '南华大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'usc_01.js',
        importUrl: 'http://jwzx.usc.edu.cn:8924',
        maintainer: 'UVhyx',
        description: '南华大学教务在线（湖南强智科技 jsxsd）适配，支持获取开学日期'
      }
    ]
  },
  {
    id: 'NJTECH',
    name: '南京工业大学',
    initial: 'N',
    folder: 'NJTECH',
    adapters: [
      {
        id: 'NJTECH',
        name: '南京工业大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'njtech.js',
        importUrl: 'https://jwgl.njtech.edu.cn/xtgl/login_slogin.html',
        maintainer: '星河欲转',
        description: '南京工业大学正方教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'NIIT',
    name: '南京工业职业技术大学',
    initial: 'N',
    folder: 'NIIT',
    adapters: [
      {
        id: 'NIIT',
        name: '南京工业职业技术大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'niit.js',
        importUrl: 'https://jwxt.niit.edu.cn/',
        maintainer: 'nifs1729',
        description: '点击统一身份认证登录,登录后直接点击导入即可'
      }
    ]
  },
  {
    id: 'NUAA',
    name: '南京航空航天大学',
    initial: 'N',
    folder: 'NUAA',
    adapters: [
      {
        id: 'NUAA_01',
        name: '南京航空航天大学树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nuaa_01.js',
        importUrl: 'https://aao-eas.nuaa.edu.cn/eams/login.action',
        maintainer: 'kemi-20',
        description: '南京航空航天大学旧树维教务适配。请在登录后直接点击导入。脚本通过 API 获取学期与课程，并按课表第一节课所在校区自动选择天目湖或明故宫/将军路作息。'
      }
    ]
  },
  {
    id: 'NJFU',
    name: '南京林业大学',
    initial: 'N',
    folder: 'NJFU',
    adapters: [
      {
        id: 'NJFU_01',
        name: '南京林业大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'njfu_01.js',
        importUrl: 'https://jwxt.njfu.edu.cn/sso.jsp',
        maintainer: 'Mercury',
        description: '南京林业大学适配教务'
      }
    ]
  },
  {
    id: 'NJNU',
    name: '南京师范大学',
    initial: 'N',
    folder: 'NJNU',
    adapters: [
      {
        id: 'NJNU',
        name: '南京师范大学金智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'njnu.js',
        importUrl: 'https://authserver.nnu.edu.cn/authserver/login?service=https://hsnnu.nnu.edu.cn/login',
        maintainer: 'aryunm',
        description: '南京师范大学金智教务适配'
      }
    ]
  },
  {
    id: 'NUIST',
    name: '南京信息工程大学',
    initial: 'N',
    folder: 'NUIST',
    adapters: [
      {
        id: 'NUIST_01',
        name: '南京信息工程大学教务课表',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nuist.js',
        importUrl: 'https://jwxt.nuist.edu.cn/',
        maintainer: 'wild0408',
        description: '南京信息工程大学金智教务系统课表适配'
      }
    ]
  },
  {
    id: 'NJCIT',
    name: '南京信息职业技术学院',
    initial: 'N',
    folder: 'NJCIT',
    adapters: [
      {
        id: 'NJCIT',
        name: '南京信息职业技术学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'njcit.js',
        importUrl: 'https://jw.njcit.cn/sso/lyiotlogin',
        maintainer: 'astraumbra',
        description: '南京信息职业技术学院教务适配，登录后可直接导入'
      }
    ]
  },
  {
    id: 'NJUPT',
    name: '南京邮电大学',
    initial: 'N',
    folder: 'NJUPT',
    adapters: [
      {
        id: 'NJUPT_01',
        name: '南京邮电大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'njupt_01.js',
        importUrl: 'https://i.njupt.edu.cn/',
        maintainer: 'kemi-20',
        description: '南京邮电大学正方教务 V9 课表导入。请先登录智慧校园并进入教务系统课表页面，再点击导入；脚本将通过 API 获取学年学期、课程、开学日期及学校作息时间。'
      }
    ]
  },
  {
    id: 'NANKAI',
    name: '南开大学',
    initial: 'N',
    folder: 'NANKAI',
    adapters: [
      {
        id: 'NANKAI',
        name: '南开大学研究生教育综合管理系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'nankai.js',
        importUrl: 'https://yjs.nankai.edu.cn/py/page/student/grkcb.htm',
        maintainer: 'Cure',
        description: '南开大学研究生院(yjs.nankai.edu.cn)适配, 需校园网环境，登录后即可直接导入, '
      }
    ]
  },
  {
    id: 'NTU',
    name: '南通大学',
    initial: 'N',
    folder: 'NTU',
    adapters: [
      {
        id: 'NTU',
        name: '南通大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ntu.js',
        importUrl: 'https://tdjw.ntu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'MX703',
        description: '南通大学正方教务V9适配。'
      }
    ]
  },
  {
    id: 'NYNU',
    name: '南阳师范学院',
    initial: 'N',
    folder: 'NYNU',
    adapters: [
      {
        id: 'NYNU_01',
        name: '南阳师范学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nynu.js',
        importUrl: 'https://vpn.nynu.edu.cn/',
        maintainer: 'Haooz',
        description: '南阳师范学院青果教务系统课表导入，需先登录学校VPN并通过统一身份认证进入教务系统后执行导入'
      }
    ]
  },
  {
    id: 'IMU',
    name: '内蒙古大学',
    initial: 'N',
    folder: 'IMU',
    adapters: [
      {
        id: 'IMU_01',
        name: '内蒙古大学URP教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'imu_01.js',
        importUrl: 'https://jwxt.imu.edu.cn/login',
        maintainer: '星河欲转',
        description: '内蒙古大学URP教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'IMUT',
    name: '内蒙古工业大学',
    initial: 'N',
    folder: 'IMUT',
    adapters: [
      {
        id: 'IMUT_01',
        name: '内蒙古工业大学教务处适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'IMUT_01.js',
        importUrl: 'http://jw.imut.edu.cn/academic/login/imut/loginIds6Valid.jsp',
        maintainer: 'wuko233',
        description: '内蒙古工业大学教务处适配，采用新版统一身份认证登录页面'
      }
    ]
  },
  {
    id: 'NBUT',
    name: '宁波工程学院',
    initial: 'N',
    folder: 'NBUT',
    adapters: [
      {
        id: 'NBUT_01',
        name: '宁波工程学院教务系统适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nbut.js',
        importUrl: 'http://jwxt.nbut.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'xiekeqing',
        description: '先登录到教务网站，登录成功后执行导入操作'
      }
    ]
  },
  {
    id: 'QQHRU',
    name: '齐齐哈尔大学',
    initial: 'Q',
    folder: 'QQHRU',
    adapters: [
      {
        id: 'QQHRU',
        name: '齐齐哈尔大学URP教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qqhru.js',
        importUrl: 'https://webvpn.qqhru.edu.cn/users/sign_in',
        maintainer: '星河欲转',
        description: '齐齐哈尔大学URP教务，登录后只需要进入教务系统就可以点击导入了，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'QQHRIT',
    name: '齐齐哈尔工程学院',
    initial: 'Q',
    folder: 'QQHRIT',
    adapters: [
      {
        id: 'QQHRIT',
        name: '齐齐哈尔工程学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qqhrit.js',
        importUrl: 'http://tysf.qqhrit.com:20261/cas/login',
        maintainer: '星河欲转',
        description: '齐齐哈尔工程学院正方教务，进入教务系统再点击导入，已添加特殊时间方案，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'QDU',
    name: '青岛大学',
    initial: 'Q',
    folder: 'QDU',
    adapters: [
      {
        id: 'QDU_01',
        name: '青岛大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qdu_01.js',
        importUrl: 'https://xjw.qdu.edu.cn/',
        maintainer: 'JellyfisHawthorn',
        description: '青岛大学强智教务，由本校开发者适配。T1、T2时段的名称需要自行设置且课程需要自行导入。T1、T2时段的时间仅供参考，请以实际为准。'
      }
    ]
  },
  {
    id: 'QDHHC',
    name: '青岛黄海学院',
    initial: 'Q',
    folder: 'QDHHC',
    adapters: [
      {
        id: 'QDHHC',
        name: '青岛黄海学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qdhhc.js',
        importUrl: 'http://jwxt.qdhhc.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: '星河欲转',
        description: '青岛黄海学院正方教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'QUT',
    name: '青岛理工大学',
    initial: 'Q',
    folder: 'QUT',
    adapters: [
      {
        id: 'QUT',
        name: '青岛理工大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qut.js',
        importUrl: 'https://jxgl.qut.edu.cn/jwglxt/xtgl/index_initMenu.html',
        maintainer: 'LucasAndrew0120',
        description: '适配青岛理工大学正方教务系统'
      }
    ]
  },
  {
    id: 'QAU',
    name: '青岛农业大学',
    initial: 'Q',
    folder: 'QAU',
    adapters: [
      {
        id: 'QAU_01',
        name: '青岛农业大学综合教务管理系统（强智科技）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qau_01.js',
        importUrl: 'http://jwglxt.qau.edu.cn/',
        maintainer: 'ReGoMark',
        description: '适用于青岛农业大学(仅限青岛校区、平度校区和蓝谷校区)的本科生个人课表导入'
      }
    ]
  },
  {
    id: 'qingguo_jiaowu',
    name: '青果教务-通用教务',
    initial: 'Q',
    folder: 'qingguo_jiaowu',
    adapters: [
      {
        id: 'qingguo_01',
        name: '青果教务html通用获取',
        category: 'GENERAL_TOOL',
        assetJsPath: 'qingguo_01.js',
        importUrl: '',
        maintainer: '星河欲转',
        description: '输入教务网址，登录，切换到个人课表页面点击执行导入'
      }
    ]
  },
  {
    id: 'QHNU',
    name: '青海师范大学',
    initial: 'Q',
    folder: 'QHNU',
    adapters: [
      {
        id: 'QHNU_01',
        name: '青海师范大学研究生课表导入',
        category: 'POSTGRADUATE',
        assetJsPath: 'qhnu_01.js',
        importUrl: 'http://one.qhnu.edu.cn/default/portal/index.jsp',
        maintainer: 'shixiaogaoya',
        description: '完成统一身份认证并进入研究生教务系统后执行导入，在弹窗中选择目标学期。'
      }
    ]
  },
  {
    id: 'QFNU',
    name: '曲阜师范大学',
    initial: 'Q',
    folder: 'QFNU',
    adapters: [
      {
        id: 'QFNU_01',
        name: '曲阜师范大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qfnu_01.js',
        importUrl: 'http://zhjw.qfnu.edu.cn/jsxsd/',
        maintainer: 'Yumu-banxia',
        description: '曲阜师范大学强智教务课表导入，自动读取学期下拉与教学周历，支持无教师或无教室结构的课程。\n教务系统不提供节次时间，导入后需在软件内设置上课时间'
      }
    ]
  },
  {
    id: 'QVTU',
    name: '泉州职业技术大学',
    initial: 'Q',
    folder: 'QVTU',
    adapters: [
      {
        id: 'QVTU',
        name: '泉州职业技术大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'qvtu.js',
        importUrl: 'https://jw.qvtu.edu.cn/jsxsd/',
        maintainer: 'suiren0219',
        description: '泉州职业技术大学强智教务。登录教务系统后直接导入即可，可选择学期；开学日期与总周数取自教学周历。有问题请通过 GitHub 联系开发者。'
      }
    ]
  },
  {
    id: 'SMXY',
    name: '三明学院',
    initial: 'S',
    folder: 'SMXY',
    adapters: [
      {
        id: 'SMXY',
        name: '三明学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'smxy.js',
        importUrl: 'https://one.fjsmu.edu.cn/tp_up/view?m=up',
        maintainer: 'Haooz',
        description: '三明学院正方教务V9，通过CAS统一身份认证登录后进入教务系统执行导入'
      }
    ]
  },
  {
    id: 'CTGU',
    name: '三峡大学',
    initial: 'S',
    folder: 'CTGU',
    adapters: [
      {
        id: 'CTGU',
        name: '三峡大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ctgu.js',
        importUrl: 'http://jwxt.ctgu.edu.cn/jwapp/sys/yjsrzfwapp/dbLogin/main.do',
        maintainer: '星河欲转',
        description: '点击统一身份认证登录,\n由于存在作用域问题,登录后需要点击课程表跳转课表页面才能让一键导入课表使用,\n非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SDUFE',
    name: '山东财经大学',
    initial: 'S',
    folder: 'SDUFE',
    adapters: [
      {
        id: 'SDUFE_01',
        name: '山东财经大学强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sdufe_01.js',
        importUrl: 'http://jw.sdufe.edu.cn/',
        maintainer: 'Kurisu90',
        description: '适用于 jw.sdufe.edu.cn 的强智教务。登录教务系统后直接点击开始导入,可选择学期,并自动获取开学日期。如有问题欢迎提交 issue。'
      }
    ]
  },
  {
    id: 'YSSDUFE',
    name: '山东财经大学燕山学院',
    initial: 'S',
    folder: 'YSSDUFE',
    adapters: [
      {
        id: 'YSSDUFE_01',
        name: '山东财经大学燕山学院强智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'yssdufe_01.js',
        importUrl: 'https://ysjw.sdufe.edu.cn:8081/jsxsd/',
        maintainer: '星河欲转',
        description: '山东财经大学燕山学院强智教务，进入教务后直接点击开始导入，支持获取开学日期，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'HUAYU',
    name: '山东华宇工学院',
    initial: 'S',
    folder: 'HUAYU',
    adapters: [
      {
        id: 'HUAYU_01',
        name: '山东华宇工学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'huayu.js',
        importUrl: 'http://jwgl.huayu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Noxiouskoala1',
        description: '适配山东华宇工学院正方教务系统'
      }
    ]
  },
  {
    id: 'SDJTU',
    name: '山东交通学院',
    initial: 'S',
    folder: 'SDJTU',
    adapters: [
      {
        id: 'SDJTU',
        name: '山东交通学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sdjtu.js',
        importUrl: 'https://wwebvpn.sdjtu.edu.cn',
        maintainer: 'WuL0ong',
        description: '适配山东交通学院教务系统，登录成功后进入教务系统，找到“学期理论课表”，在“学年学期”下拉框内选择要导入的学期课表，之后点击“执行导入”按钮即可。\n学期理论课表默认为当前学期，若导入本学期课表则无需修改。\n目前仅支持导入“学期理论课表”内任意学期的课表，暂不支持导入其它类型的课表。'
      }
    ]
  },
  {
    id: 'SDLIVC',
    name: '山东轻工职业学院',
    initial: 'S',
    folder: 'SDLIVC',
    adapters: [
      {
        id: 'SDLIVC',
        name: '山东轻工职业学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sdlivc.js',
        importUrl: 'https://crp.sdlivc.cn/xsgl/xs/login/login.aspx',
        maintainer: '赛博丁真',
        description: '山东轻工职业学院教务适配'
      }
    ]
  },
  {
    id: 'SDNU',
    name: '山东师范大学',
    initial: 'S',
    folder: 'SDNU',
    adapters: [
      {
        id: 'SDNU',
        name: '山东师范大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sdnu.js',
        importUrl: 'http://jwxt.sdnu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'LiquoriceHy',
        description: '山东师范大学教务系统适配'
      }
    ]
  },
  {
    id: 'SDIPCT',
    name: '山东石油化工学院',
    initial: 'S',
    folder: 'SDIPCT',
    adapters: [
      {
        id: 'SDIPCT',
        name: '山东石油化工学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sdipct.js',
        importUrl: 'https://webvpn.sdipct.edu.cn/https/77726476706e69737468656265737421fae0598869236c596e0b9de29d51367bd943/',
        maintainer: '星河欲转',
        description: '山东石油化工学院教务适配,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SDWCVC',
    name: '山东水利职业学院',
    initial: 'S',
    folder: 'SDWCVC',
    adapters: [
      {
        id: 'SDWCVC_01',
        name: '山东水利职业学院树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sdwcvc_01.js',
        importUrl: 'https://sso.sdwcvc.cn/',
        maintainer: '小漫君',
        description: '登录统一认证并在门户中打开教务系统后导入，按所选学期读取课程与校历，使用学校公布的统一作息（第1～10节）。'
      }
    ]
  },
  {
    id: 'SDDFVC',
    name: '山东药品食品职业学院',
    initial: 'S',
    folder: 'SDDFVC',
    adapters: [
      {
        id: 'SDDFVC',
        name: '山东药品食品职业学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sddfvc.js',
        importUrl: 'https://cas.sddfvc.edu.cn/login?type=usernamepassword&service=http%3A%2F%2Ffazhan.sddfvc.edu.cn%2Fjs%2Ffzzx%2Flogin',
        maintainer: '星河欲转',
        description: '山东药品食品职业学院教务适配,非本校开发者适配如果有误建议提交issues \n\n贵校网页经常变化参数我们需要本校的有兴趣的同学来主动维护适配的代码'
      }
    ]
  },
  {
    id: 'SXDZKJ',
    name: '山西电子科技学院',
    initial: 'S',
    folder: 'SXDZKJ',
    adapters: [
      {
        id: 'SXDZKJ',
        name: '山西电子科技学院青果教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sxdzkj.js',
        importUrl: 'https://sso.sxdzkj.edu.cn/sso-auth/#/login?service=https://jwxt.sxdzkj.edu.cn/caslogin',
        maintainer: 'REnss3536',
        description: '山西电子科技学院青果教务系统适配，登录教务系统后进入课表查询页面进行导入'
      }
    ]
  },
  {
    id: 'SXGCXY',
    name: '山西工程职业学院',
    initial: 'S',
    folder: 'SXGCXY',
    adapters: [
      {
        id: 'SXGCXY_01',
        name: '山西工程职业学院超星教务适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sxgcxy_01.js',
        importUrl: 'https://sxevc.jw.chaoxing.com/admin/login',
        maintainer: '星河欲转',
        description: '山西工程职业学院适配教务,支持唐槐校区、龙潭校区作息时间,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SHUFEZJ',
    name: '上海财经大学浙江学院',
    initial: 'S',
    folder: 'SHUFEZJ',
    adapters: [
      {
        id: 'SHUFEZJ',
        name: '上海财经大学浙江学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'shufezj.js',
        importUrl: 'https://jwxt.shufe-zj.edu.cn/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N2151&layout=default',
        maintainer: 'ZnonEn',
        description: '上海财经大学浙江学院正方教务，通过CAS统一身份认证登录后，进入个人课表查询页面即可点击导入。非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SHIEP',
    name: '上海电力大学',
    initial: 'S',
    folder: 'SHIEP',
    adapters: [
      {
        id: 'SHIEP_01',
        name: '上海电力大学本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'SHIEP.js',
        importUrl: 'https://jw.shiep.edu.cn/eams/index.action',
        maintainer: 'zt11125',
        description: '从统一身份认证入口登录后进入教务系统,在右上角打开电脑模式，进入教务系统可直接导入不用在意页面异常'
      }
    ]
  },
  {
    id: 'LIDAPOLY',
    name: '上海立达学院',
    initial: 'S',
    folder: 'LIDAPOLY',
    adapters: [
      {
        id: 'LIDAPOLY',
        name: '上海立达学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'lidapoly.js',
        importUrl: 'http://jw.lidapoly.edu.cn/shldzyjsxy_jsxsd',
        maintainer: 'Haooz',
        description: '上海立达学院课表导入，请先登录教务系统，再点击导入！非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'SHNU',
    name: '上海师范大学',
    initial: 'S',
    folder: 'SHNU',
    adapters: [
      {
        id: 'SHNU_01',
        name: '上海师范大学树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'shnu.js',
        importUrl: 'https://course.shnu.edu.cn/',
        maintainer: 'FaQxD233',
        description: '上海师范大学本科生教务系统(course.shnu.edu.cn/eams)适配，支持选择学期。登录之后直接导入不用点网页，加载不出来不重要。'
      }
    ]
  },
  {
    id: 'SHZQ',
    name: '上海中侨职业技术大学',
    initial: 'S',
    folder: 'SHZQ',
    adapters: [
      {
        id: 'SHZQ_01',
        name: '上海中侨职业技术大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'shzq.js',
        importUrl: 'https://cas.shzq.edu.cn/cas/login?service=https://jw.shzq.edu.cn/sso/ddlogin',
        maintainer: 'Kredenk',
        description: '上海中侨大学正方教务适配，支持获取开学日期'
      }
    ]
  },
  {
    id: 'SYIST',
    name: '沈阳科技学院',
    initial: 'S',
    folder: 'SYIST',
    adapters: [
      {
        id: 'SYIST_01',
        name: '沈阳科技学院金智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'syist_01.js',
        importUrl: 'http://jwxt.syist.edu.cn:30334/jwapp/sys/emaphome/portal/index.do',
        maintainer: '星河欲转',
        description: '沈阳科技学院金智教务，支持自动获取开学日期，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SCTBC',
    name: '四川工商职业技术学院',
    initial: 'S',
    folder: 'SCTBC',
    adapters: [
      {
        id: 'SCTBC_01',
        name: '四川工商职业技术学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sctbc.js',
        importUrl: 'http://jw.sctbc.edu.cn/xtgl/login_slogin.html',
        maintainer: 'dclindev',
        description: '正方教务 V9 新一代（前端 zftal-ui-v5，根路径部署）。可用正方直登（本条目地址）或统一身份认证 cas.sctbc.edu.cn 登录，停留在任意教务页面点击导入即可，自动读取学年学期、课表、开学日期与节次作息。'
      }
    ]
  },
  {
    id: 'SCEMI',
    name: '四川机电职业技术学院',
    initial: 'S',
    folder: 'SCEMI',
    adapters: [
      {
        id: 'SCEMI_01',
        name: '四川机电职业技术学院教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'scemi_01.js',
        importUrl: 'http://192.168.73.155/personal-center',
        maintainer: '小漫君',
        description: '四川机电职业技术学院正方新一代教务适配，仅校园网内可用：请在校园网环境下从校内门户 192.168.73.155/personal-center 登录，教务服务为 192.168.73.166/jwglxt（公网 zhjw.scemi.com 会被 webproxy 按来源网段拦截）。登录并进入教务后，在任意页面执行导入即可，无需进入课表查询页面；脚本自动读取学年学期并获取课表与真实节次作息。'
      }
    ]
  },
  {
    id: 'SICNU',
    name: '四川师范大学',
    initial: 'S',
    folder: 'SICNU',
    adapters: [
      {
        id: 'SICNU_01',
        name: '四川师范大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'school.js',
        importUrl: 'http://202.115.194.60/',
        maintainer: 'llingqing',
        description: '支持狮子山校区和成龙校区，自动识别学期和课程时间，另可从大学生通进入教务系统(https://zhxg.sicnu.edu.cn/edu/admin/)'
      }
    ]
  },
  {
    id: 'SCETOP',
    name: '四川托普信息技术职业学院',
    initial: 'S',
    folder: 'SCETOP',
    adapters: [
      {
        id: 'SCETOP_01',
        name: '四川托普信息技术职业学院-正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'scetop_zf_legacy.js',
        importUrl: 'http://zf.scetop.com/default2.aspx',
        maintainer: 'psenY',
        description: '四川托普信息技术职业学院教务系统课表导入。登录后在「信息查询」里打开「学生个人课表」或「班级课表查询」，显示出周课表即可导入。导入会同时看三个页面：必修类的课以班级课表为准（班级课表调课会及时更新），选修课以个人课表为准；班级课表里没有的课会从个人课表补上，不会漏课。上课时间按学校作息自动设置（A 教学区以外的第 3、4 节和周五下午会单独调整）。没有固定上课时间的实践、实训类课程不会导入，可以手动添加。'
      }
    ]
  },
  {
    id: 'SUDA',
    name: '苏州大学',
    initial: 'S',
    folder: 'SUDA',
    adapters: [
      {
        id: 'SUDA_01',
        name: '苏州大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'suda.js',
        importUrl: 'http://xk.suda.edu.cn/',
        maintainer: 'BernardYan2357',
        description: '苏州大学教务系统适配，网页仅在校园网/连接校内VPN环境下可访问'
      }
    ]
  },
  {
    id: 'AHSZU',
    name: '宿州学院',
    initial: 'S',
    folder: 'AHSZU',
    adapters: [
      {
        id: 'AHSZU_01',
        name: '宿州学院青果教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ahszu_01.js',
        importUrl: 'http://211.86.128.194/suzxyjw/cas/login.action',
        maintainer: '星河欲转',
        description: '宿州学院青果教务适配,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'SHXY',
    name: '绥化学院',
    initial: 'S',
    folder: 'SHXY',
    adapters: [
      {
        id: 'SHXY',
        name: '绥化学院乘方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'shxy.js',
        importUrl: 'http://jwgl.shxy.edu.cn/',
        maintainer: 'Haooz',
        description: '绥化学院乘方教务系统，进入教务系统后点击导入'
      }
    ]
  },
  {
    id: 'TARU',
    name: '塔里木大学',
    initial: 'T',
    folder: 'TARU',
    adapters: [
      {
        id: 'TARU_01',
        name: '塔里木大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'taru_01.js',
        importUrl: 'https://auth.taru.edu.cn/cas/login?service=https%3A%2F%2Fhall.taru.edu.cn%2FserviceHall',
        maintainer: '星河欲转',
        description: '登录后需要进入查看课表的页面，才可以点击导入 \n\n塔里木大学适配教务,添加双季作息,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'TSU',
    name: '泰山学院',
    initial: 'T',
    folder: 'TSU',
    adapters: [
      {
        id: 'TSU_01',
        name: '泰山学院青果教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'tsu_01.js',
        importUrl: 'http://jwxt.tsu.edu.cn',
        maintainer: '素绫理',
        description: '泰山学院青果教务系统课表适配，登陆教务系统后在任意页面点击【执行导入】即可（课表数据经接口获取，不依赖当前页面）。导入时可选择学期，开学日期自动获取；脚本会自动提交夏/冬令时组合作息（夏令时5月1日–10月7日，冬令时10月8日–次年4月30日）'
      }
    ]
  },
  {
    id: 'TCU',
    name: '天津城建大学',
    initial: 'T',
    folder: 'TCU',
    adapters: [
      {
        id: 'TCU_01',
        name: '天津城建大学URP教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'tcu_01.js',
        importUrl: 'https://authserver.tcu.edu.cn/authserver/login?service=https%3A%2F%2Fjwxs.tcu.edu.cn%2Flogin',
        maintainer: '星河欲转',
        description: '天津城建大学URP教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'TUST',
    name: '天津科技大学',
    initial: 'T',
    folder: 'TUST',
    adapters: [
      {
        id: 'TUST_01',
        name: '天津科技大学URP教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'tust_01.js',
        importUrl: 'https://id.tust.edu.cn/authserver/login?service=http://jwxtxs.tust.edu.cn:46110/j_spring_cas_security_check',
        maintainer: 'oneepointer',
        description: '天津科技大学使用 URP 教务系统，该适配器对其进行适配'
      }
    ]
  },
  {
    id: 'TJAU',
    name: '天津农学院',
    initial: 'T',
    folder: 'TJAU',
    adapters: [
      {
        id: 'TJAU',
        name: '天津农学院树维教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'tjau.js',
        importUrl: 'http://jwxt.tjau.edu.cn/eams/homeExt.action',
        maintainer: '星河欲转',
        description: '天津农学院树维教务适配，登录后直接点击导入,无视可能出现的显示异常,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'GLOBAL_TOOLS',
    name: '通用工具与服务',
    initial: 'T',
    folder: 'GLOBAL_TOOLS',
    adapters: [
      {
        id: 'GENERAL_TOOL_01',
        name: '组件测试',
        category: 'GENERAL_TOOL',
        assetJsPath: 'school.js',
        importUrl: '',
        maintainer: '星河欲转',
        description: '这是一个空网站，用于组件测试与演示模式'
      },
      {
        id: 'GENERAL_TOOL_02',
        name: '适配代码测试',
        category: 'GENERAL_TOOL',
        assetJsPath: 'test.js',
        importUrl: '',
        maintainer: '星河欲转',
        description: '空网站以及不存在适配代码,用于在不更新索引的情况下给开发者进行适配的软件测试'
      },
      {
        id: 'WakeUp',
        name: 'WakeUp课程表分享口令导入(支持新版)',
        category: 'GENERAL_TOOL',
        assetJsPath: 'wake_up.js',
        importUrl: 'https://api.wakeup.fun/',
        maintainer: 'Airline233、星河欲转',
        description: '从WakeUP获取分享口令后，进入适配直接点击"执行导入"，输入分享口令即可'
      },
      {
        id: 'StarLink',
        name: '星链课表分享码导入',
        category: 'GENERAL_TOOL',
        assetJsPath: 'starlink.js',
        importUrl: 'https://api.starlinkkb.cn/',
        maintainer: '星河欲转',
        description: '首先,先去星链课表获取分享码，然后点击本适配，进入后不需要管网页，点击"执行导入"输入你刚刚获取的分享码就好'
      }
    ]
  },
  {
    id: 'TONGJI',
    name: '同济大学',
    initial: 'T',
    folder: 'TONGJI',
    adapters: [
      {
        id: 'TONGJI_01',
        name: '同济大学 1 系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'tongji_01.js',
        importUrl: 'https://1.tongji.edu.cn/',
        maintainer: 'Linho1219',
        description: '同济大学教学信息管理一体化系统（1 系统）适配。无需进入课表页面，统一认证登录完成进入 1 系统后即可提取'
      }
    ]
  },
  {
    id: 'GZTRC',
    name: '铜仁学院',
    initial: 'T',
    folder: 'GZTRC',
    adapters: [
      {
        id: 'GZTRC',
        name: '铜仁学院联奕教务（新版教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gztrc.js',
        importUrl: 'https://gztrc.edu.cn:17232/',
        maintainer: 'Daoguan-king',
        description: '由于教务系统未适配手机端，须在右上角选择"切换到电脑模式"，然后点击"刷新"，正常登录后点击下方"执行导入"按钮进行导入。'
      },
      {
        id: 'GZTRC_OLD',
        name: '铜仁学院移动教务（旧版教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'gztrc_old.js',
        importUrl: 'https://gztrc.edu.cn:17230/yjw/pages/login/login.html',
        maintainer: 'Daoguan-king',
        description: '此教务系统适配手机端，请在教务系统中正常登录并进入主页后，点击教务系统下方"快捷查询->课程表"页面后再电击"执行导入"按钮进行导入。由于学校太懒，校历数据未配置，导入后需在软件中手动设置开学日期。'
      }
    ]
  },
  {
    id: 'urp_jiaowu',
    name: 'URP教务-通用教务',
    initial: 'U',
    folder: 'urp_jiaowu',
    adapters: [
      {
        id: 'urp_01',
        name: 'URP教务通用获取',
        category: 'GENERAL_TOOL',
        assetJsPath: 'urp_01.js',
        importUrl: '',
        maintainer: '星河欲转',
        description: '输入教务网址，登录，切换到个人课表页面点击执行导入'
      }
    ]
  },
  {
    id: 'WENHUA',
    name: '文华学院',
    initial: 'W',
    folder: 'WENHUA',
    adapters: [
      {
        id: 'WENHUA_01',
        name: '文华学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'wenhua_01.js',
        importUrl: 'https://jw1.hustwenhua.net/jwglxt/xtgl/login_slogin.html',
        maintainer: 'glxgo',
        description: '文华学院教务,登录后需要进入教务系统才可以点击导入,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'CWXU',
    name: '无锡学院',
    initial: 'W',
    folder: 'CWXU',
    adapters: [
      {
        id: 'CWXU_01',
        name: '无锡学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cwxu_01.js',
        importUrl: 'https://jwgl.cwxu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'ewiro',
        description: '无锡学院正方教务系统适配，登录后选择学年和学期即可通过教务接口导入课表。'
      }
    ]
  },
  {
    id: 'WZZY',
    name: '梧州职业学院',
    initial: 'W',
    folder: 'WZZY',
    adapters: [
      {
        id: 'WZZY_01',
        name: '梧州职业学院青果教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'wzzy_01.js',
        importUrl: 'http://222.217.195.24:805/wzzyjw/cas/login.action',
        maintainer: '星河欲转',
        description: '梧州职业学院青果教务，支持自动获取开学日期，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'WHCB',
    name: '武汉船舶职业技术学院',
    initial: 'W',
    folder: 'WHCB',
    adapters: [
      {
        id: 'WHCB_1',
        name: '武汉船舶职业技术学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'WHCB.js',
        importUrl: 'http://jw.wspc.edu.cn/jwapp/sys/wdkb/*default/index.do?EMAP_LANG=zh#/xskcb',
        maintainer: '一丝不旺',
        description: '适配武汉船舶职业技术学院，学校网站很烂，课程表可能会加载一段时间，多等会'
      }
    ]
  },
  {
    id: 'WUST',
    name: '武汉科技大学',
    initial: 'W',
    folder: 'WUST',
    adapters: [
      {
        id: 'WUST_01',
        name: '武汉科技大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'wust.js',
        importUrl: 'https://bkjx.wust.edu.cn/jsxsd/framework/xsMain.jsp',
        maintainer: 'xsddszrc',
        description: '用于武汉科技大学教务系统的课程表导入'
      }
    ]
  },
  {
    id: 'WHUT',
    name: '武汉理工大学',
    initial: 'W',
    folder: 'WHUT',
    adapters: [
      {
        id: 'WHUT_01',
        name: '武汉理工大学金智教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'whut_01.js',
        importUrl: 'https://jwxt.whut.edu.cn/',
        maintainer: '星河欲转',
        description: '武汉理工大学金智教务,支持自动获取开学日期,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'WBU',
    name: '武汉商学院',
    initial: 'W',
    folder: 'WBU',
    adapters: [
      {
        id: 'WBU_02',
        name: '武汉商学院-校园网访问',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'wbu_02.js',
        importUrl: 'https://jwxt.wbu.edu.cn/',
        maintainer: 'HJWqa',
        description: '武汉商学院教务系统课表导入适配'
      },
      {
        id: 'WBU_03',
        name: '武汉商学院-WebVPN访问',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'wbu_02.js',
        importUrl: 'https://webvpn.wbu.edu.cn/',
        maintainer: 'HJWqa',
        description: '武汉商学院教务系统课表导入适配'
      }
    ]
  },
  {
    id: 'XMCU',
    name: '厦门城市职业学院',
    initial: 'X',
    folder: 'XMCU',
    adapters: [
      {
        id: 'XMCU_01',
        name: '厦门城市职业学院青果教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xmcu_01.js',
        importUrl: 'https://eone-443.webvpn.xmcu.edu.cn/',
        maintainer: '星河欲转',
        description: '输入账号密码登录，进入融合信息门户，在应用中心找到教务系统并进入，在左侧找到教学安排，点击后即可看到学生个人课表。\n厦门城市职业学院适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XATU',
    name: '西安工业大学',
    initial: 'X',
    folder: 'XATU',
    adapters: [
      {
        id: 'XATU_01',
        name: '西安工业大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'myschool.js',
        importUrl: 'http://jwgl2018.xatu.edu.cn',
        maintainer: '晨熯',
        description: '树维教务系统适配'
      }
    ]
  },
  {
    id: 'XAUAT',
    name: '西安建筑科技大学',
    initial: 'X',
    folder: 'XAUAT',
    adapters: [
      {
        id: 'XAUAT_01',
        name: '西安建筑科技大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xauat.js',
        importUrl: 'https://swjw.xauat.edu.cn/student/login/',
        maintainer: 'Alph4rc',
        description: '西安建筑科技大学教务系统适配，请先登录统一身份认证，手动点击进入教务系统后执行脚本自动获取课程信息'
      }
    ]
  },
  {
    id: 'XJTU',
    name: '西安交通大学',
    initial: 'X',
    folder: 'XJTU',
    adapters: [
      {
        id: 'XJTU_01',
        name: '西安交通大学-本科教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xjtu.js',
        importUrl: 'https://ehall.xjtu.edu.cn',
        maintainer: 'SDPD, TiaoFeng',
        description: '适配西安交通大学教务系统(wdkb)本科课表导入'
      }
    ]
  },
  {
    id: 'XUST',
    name: '西安科技大学',
    initial: 'X',
    folder: 'XUST',
    adapters: [
      {
        id: 'XUST_01',
        name: '西安科技大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xust_01.js',
        importUrl: 'http://jwsso.xust.edu.cn/frontend/center_portal/home/index.html#/',
        maintainer: '星河欲转',
        description: '西安科技大学正方教务，已适配西区差异时间，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XAUT',
    name: '西安理工大学',
    initial: 'X',
    folder: 'XAUT',
    adapters: [
      {
        id: 'XAUT_01',
        name: '西安理工大学适配教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'XAUT_01.js',
        importUrl: 'http://jwgl.xaut.edu.cn/',
        maintainer: 'dezige131',
        description: '西安理工大学适配教务,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XSYU',
    name: '西安石油大学',
    initial: 'X',
    folder: 'XSYU',
    adapters: [
      {
        id: 'XSYU_01',
        name: '西安石油大学超星教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xsyu_01.js',
        importUrl: 'https://jiaowu.xsyu.edu.cn/admin/login',
        maintainer: 'dr1am1',
        description: '西安石油大学超星综合教学管理系统（jiaowu.xsyu.edu.cn）课表导入，自动识别当前学期与校区，导入课程、作息时间、开学日期与总周数；支持账密登录与统一认证登录'
      }
    ]
  },
  {
    id: 'XAWL',
    name: '西安文理学院',
    initial: 'X',
    folder: 'XAWL',
    adapters: [
      {
        id: 'XAWL_01',
        name: '西安文理学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xawl_01.js',
        importUrl: 'http://jwgl.xawl.edu.cn/jwglxt/',
        maintainer: '星河欲转',
        description: '西安文理学院正方教务,添加双季作息,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'NWPU',
    name: '西北工业大学',
    initial: 'X',
    folder: 'NWPU',
    adapters: [
      {
        id: 'NWPU_01',
        name: '西北工业大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nwpu_01.js',
        importUrl: 'https://ecampus.nwpu.edu.cn/',
        maintainer: 'zengzoxiong',
        description: '西北工业大学本科教务系统适配，请先登录翱翔门户，手动点击进入翱翔教务后执行脚本自动获取课程信息'
      }
    ]
  },
  {
    id: 'NWAFU',
    name: '西北农林科技大学',
    initial: 'X',
    folder: 'NWAFU',
    adapters: [
      {
        id: 'NWAFU_01',
        name: '西北农林科技大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'nwafu.js',
        importUrl: 'https://newehall.nwafu.edu.cn/',
        maintainer: '123zhuzhu61',
        description: '西北农林科技大学：登录后进入「我的本研课表」点击执行导入。接口取数，写入学期总周数与冬令/夏令作息（硬编码）'
      }
    ]
  },
  {
    id: 'SWU',
    name: '西南大学',
    initial: 'X',
    folder: 'SWU',
    adapters: [
      {
        id: 'SWU_01',
        name: '西南大学教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'swu.js',
        importUrl: 'https://i.swu.edu.cn/',
        maintainer: '小漫君',
        description: '基于正方新一代教务接口取数。请从办事大厅(i.swu.edu.cn)登录后进入教务系统课表查询页面，再执行导入脚本；脚本会自动套用西南大学节次时间。'
      }
    ]
  },
  {
    id: 'SWJTU',
    name: '西南交通大学',
    initial: 'X',
    folder: 'SWJTU',
    adapters: [
      {
        id: 'SWJTU_01',
        name: '西南交通大学扬华学堂',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'swjtu_yhxt.js',
        importUrl: 'https://yhxt.swjtu.edu.cn/study/teach/course/stu-course-list',
        maintainer: 'Weedy233',
        description: '登录西南交通大学扬华学堂后，直接点击底栏“执行导入”即可完成导入'
      }
    ]
  },
  {
    id: 'SWFU',
    name: '西南林业大学',
    initial: 'X',
    folder: 'SWFU',
    adapters: [
      {
        id: 'SWFU',
        name: '西南林业大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'swfu.js',
        importUrl: 'https://jw.swfu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Haooz',
        description: '西南林业大学课表导入，请先登录教务系统，再点击导入！非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'XJIE',
    name: '新疆工程学院',
    initial: 'X',
    folder: 'XJIE',
    adapters: [
      {
        id: 'XJIE_01',
        name: '新疆工程学院强智适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xjie_01.js',
        importUrl: 'https://authserver.xjie.edu.cn/authserver/login?service=https%3A%2F%2Fjwxt.xjie.edu.cn%2Fjsxsd%2F',
        maintainer: '星河欲转',
        description: '新疆工程学院强智适配，支持获取开学日期，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XJZFU',
    name: '新疆政法学院',
    initial: 'X',
    folder: 'XJZFU',
    adapters: [
      {
        id: 'XJZFU_01',
        name: '新疆政法学院新教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xjzfu.js',
        importUrl: 'https://jwxt.xjzfu.edu.cn/jwapp/sys/homeapp/home/index.html',
        maintainer: 'jesse-s4',
        description: '适配新疆政法学院金智教务系统 2026.07.20'
      }
    ]
  },
  {
    id: 'XYAFU',
    name: '信阳农林学院',
    initial: 'X',
    folder: 'XYAFU',
    adapters: [
      {
        id: 'XYAFU_01',
        name: '信阳农林学院青果教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xyafu_01.js',
        importUrl: 'https://sso.xyafu.edu.cn/sso/login?service=https%3A%2F%2Fjwgl.xyafu.edu.cn%2Fcaslogin',
        maintainer: 'glxgo',
        description: '信阳农林学院教务,登录后需要进入教务系统才可以点击导入,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XZIT',
    name: '徐州工程学院',
    initial: 'X',
    folder: 'XZIT',
    adapters: [
      {
        id: 'XZIT_01',
        name: '徐州工程学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xzit_01.js',
        importUrl: 'http://jwglxt.xzit.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: '盐泡',
        description: '徐州工程学院正方教务系统适配，登录选择个人课表页面导入即可。'
      }
    ]
  },
  {
    id: 'XZHMU',
    name: '徐州医科大学',
    initial: 'X',
    folder: 'XZHMU',
    adapters: [
      {
        id: 'XZHMU_01',
        name: '徐州医科大学研究生教务',
        category: 'POSTGRADUATE',
        assetJsPath: 'xzhmu_01.js',
        importUrl: 'https://authserver.xzhmu.edu.cn/authserver/login?service=https%3A%2F%2Fehall.xzhmu.edu.cn%2Flogin',
        maintainer: '星河欲转',
        description: '徐州医科大学研究生教务，切换到个人课表页面点击执行导入，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'XCU',
    name: '许昌学院',
    initial: 'X',
    folder: 'XCU',
    adapters: [
      {
        id: 'XCU_01',
        name: '许昌学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xcu_01.js',
        importUrl: 'https://jwglxt.xcu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: '拉里',
        description: '登录教务系统后开始导入，确认默认学期即可导入，也可更换学年、学期。自动获取课程和作息，并尝试获取开学日期及学期总周数；未排定时间或解析异常的课程会提示，请核对后保存。'
      }
    ]
  },
  {
    id: 'XHKJZYXY',
    name: '宣化科技职业学院',
    initial: 'X',
    folder: 'XHKJZYXY',
    adapters: [
      {
        id: 'XHKJZYXY_01',
        name: '宣化科技职业学院正方适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'xhkjzyxy_01.js',
        importUrl: 'https://xhkjzyxy.edu.cn:18088/cas/login?service=https%3A%2F%2Fxhkjzyxy.edu.cn%3A8387%2Fsso%2Fjziotlogin',
        maintainer: '星河欲转',
        description: '宣化科技职业学院正方适配，支持获取开学日期，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'YSU',
    name: '燕山大学',
    initial: 'Y',
    folder: 'YSU',
    adapters: [
      {
        id: 'YSU_YJS',
        name: '燕山大学研究生管理系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'ysu_yjs.js',
        importUrl: 'https://cer.ysu.edu.cn/authserver/login?service=https%3A%2F%2Fyjsxt.ysu.edu.cn%2Fapi%2FcasLogin%2Fysu',
        maintainer: 'Haooz',
        description: '燕山大学研究生课表导入，请先登录研究生管理系统，再点击导入！非本校开发者，如有误请提交issues。'
      }
    ]
  },
  {
    id: 'YZU',
    name: '扬州大学',
    initial: 'Y',
    folder: 'YZU',
    adapters: [
      {
        id: 'YZU_01',
        name: '扬州大学URP教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'yzu.js',
        importUrl: 'https://webvpn.yzu.edu.cn/login',
        maintainer: 'Thanatos',
        description: '扬州大学URP教务适配,通过网瑞达WebVPN访问,登录后需进入PC端教务系统「选课管理」页面,选择历年学期课表,再点击导入.'
      }
    ]
  },
  {
    id: 'YIBINU',
    name: '宜宾学院',
    initial: 'Y',
    folder: 'YIBINU',
    adapters: [
      {
        id: 'YIBINU_01',
        name: '宜宾学院教务系统适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'yibinu_01.js',
        importUrl: 'https://authserver.yibinu.edu.cn/authserver/login?service=https://ehall.yibinu.edu.cn:443/login?service=https://ehall.yibinu.edu.cn/new/index.html',
        maintainer: '空灵',
        description: '适配宜宾学院教务，登录智慧校园后就可以执行导入，由于网站限制，需要执行2次导入才能导入包含理论和实验的完整课表，所以请仔细阅读操作提醒！！'
      }
    ]
  },
  {
    id: 'YNUFE',
    name: '云南财经大学',
    initial: 'Y',
    folder: 'YNUFE',
    adapters: [
      {
        id: 'YNUFE_01',
        name: '云南财经大学本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ynufe.js',
        importUrl: 'https://xjwis.ynufe.edu.cn/jsxsd/',
        maintainer: 'AxelPLN',
        description: '登录教务系统后直接按下面的“执行导入”即可，无需打开课表页面。'
      }
    ]
  },
  {
    id: 'UZZ',
    name: '枣庄学院',
    initial: 'Z',
    folder: 'UZZ',
    adapters: [
      {
        id: 'UZZ_01',
        name: '枣庄学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'uzz_01.js',
        importUrl: 'https://iam.uzz.edu.cn/esc-sso/login/page',
        maintainer: '素绫理',
        description: '枣庄学院方正教务系统课表适配，登陆后点击【正方教务管理系统】，再点击【个人课表查询】，最后点击【执行导入】即可，导入后不要忘记设置本学期的开学日期'
      }
    ]
  },
  {
    id: 'ZQU',
    name: '肇庆学院',
    initial: 'Z',
    folder: 'ZQU',
    adapters: [
      {
        id: 'ZQU_01',
        name: '肇庆学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zqu_01.js',
        importUrl: 'https://jwgl.zqu.edu.cn/',
        maintainer: 'NoobLLiu',
        description: '肇庆学院教务系统对接，登录进入教务系统后点击开始导入，无需打开课表查询页面，停留在教务系统任意页面即可。校外经WebVPN访问或校内直连均支持。'
      }
    ]
  },
  {
    id: 'ZJBTI',
    name: '浙江工商职业技术学院',
    initial: 'Z',
    folder: 'ZJBTI',
    adapters: [
      {
        id: 'ZJBTI_01',
        name: '浙江工商职业技术学院教务管理',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zjbti.js',
        importUrl: 'https://webvpn.zjbti.net.cn',
        maintainer: 'LanRhyme',
        description: '登录WebVPN后进入「教务管理」，在任意教务页面点击执行导入即可'
      }
    ]
  },
  {
    id: 'ZJUT',
    name: '浙江工业大学',
    initial: 'Z',
    folder: 'ZJUT',
    adapters: [
      {
        id: 'ZJUT_01',
        name: '浙江工业大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zjut_01.js',
        importUrl: 'http://www.gdjw.zjut.edu.cn/jwglxt/xtgl/login_slogin.html?kickout=1',
        maintainer: 'glxgo',
        description: '浙江工业大学教务,登录后需要进入教务系统才可以点击导入,非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'ZUST',
    name: '浙江科技大学',
    initial: 'Z',
    folder: 'ZUST',
    adapters: [
      {
        id: 'ZUST_01',
        name: '浙江科技大学（正方教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zust_01.js',
        importUrl: 'https://https-authserver-zust-edu-cn-443.webvpn.zust.edu.cn/authserver/login?appid=https://https-authserver-zust-edu-cn-443.webvpn.zust.edu.cn/authserver/logout?service=${redirect_url}&service=https://webvpn.zust.edu.cn/callback/cas/TKBCDGsz',
        maintainer: '小漫君',
        description: '登录 WebVPN 后点击教务系统，进入教学管理信息服务平台再导入。支持选择学年学期，自动读取校历和课程所属校区作息，保留原节次。'
      }
    ]
  },
  {
    id: 'ZJSRU',
    name: '浙江树人学院',
    initial: 'Z',
    folder: 'ZJSRU',
    adapters: [
      {
        id: 'ZJSRU_01',
        name: '浙江树人学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zjsru_01.js',
        importUrl: 'http://xk.jwc.zjsru.edu.cn/',
        maintainer: 'CagierAsh123',
        description: '浙江树人学院（浙江树人大学）正方教务系统，登录方式为统一身份认证 CAS，教务首页会自动跳转。导入时自动拉取学生个人课表并可选学年/学期；作息时间取自学校官方校历，拱宸桥 / 杨汛桥两个校区节次时刻不同，导入时需选择所在校区。仅支持学生个人课表。'
      }
    ]
  },
  {
    id: 'ZWU',
    name: '浙江万里学院',
    initial: 'Z',
    folder: 'ZWU',
    adapters: [
      {
        id: 'ZWU_01',
        name: '浙江万里学院正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zwu_01.js',
        importUrl: 'https://ehall.zwu.edu.cn/_layouts/15/ZWUWSBS/BSDT/HomePage.aspx#',
        maintainer: '星河欲转',
        description: '浙江万里学院正方教务，校内访问和vpn访问都可以，进入教务系统即可开始导入，支持获取开学日期，已添加令时作息'
      }
    ]
  },
  {
    id: 'ZCMU',
    name: '浙江中医药大学',
    initial: 'Z',
    folder: 'ZCMU',
    adapters: [
      {
        id: 'ZCMU',
        name: '浙江中医药大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zcmu.js',
        importUrl: 'https://jwmk.zcmu.edu.cn/jwglxt/xtgl/login_slogin.html',
        maintainer: 'Daoguan-king',
        description: '登录浙江中医药大学教务系统后需要进入“信息查询”的“个人课表查询”页面再点击导入。\n滨文校区和富春校区两个校区的时间安排不一致，请在导入课程表前选择对应的校区。\n这是通过滨文校区的教务数据开发的，不确定富春校区是否支持。\n特别感谢滨文校区生命科学学院杰哥的帮助，他在我的软磨硬泡下提供了学号和密码。\n非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'zhengfang_jiaowu',
    name: '正方教务-通用教务',
    initial: 'Z',
    folder: 'zhengfang_jiaowu',
    adapters: [
      {
        id: 'zhengfang_01',
        name: '正方教务html通用获取',
        category: 'GENERAL_TOOL',
        assetJsPath: 'zhengfang_01.js',
        importUrl: '',
        maintainer: '星河欲转',
        description: '输入教务网址，登录，切换到个人课表页面点击执行导入'
      }
    ]
  },
  {
    id: 'ZZU',
    name: '郑州大学',
    initial: 'Z',
    folder: 'ZZU',
    adapters: [
      {
        id: 'ZZU_01',
        name: '郑州大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zzu.js',
        importUrl: 'https://cas.s.zzu.edu.cn/cas/a/login?service=https%3A%2F%2Fjwxt.zzu.edu.cn%2Fstudent%2Fsso%2Flogin',
        maintainer: 'LilyCarry',
        description: '登录之后向右下角滑,点击课表.课表出现后点击右下角导入即可.'
      }
    ]
  },
  {
    id: 'ZUA',
    name: '郑州航空工业管理学院',
    initial: 'Z',
    folder: 'ZUA',
    adapters: [
      {
        id: 'ZUA_01',
        name: '郑州航空工业管理学院教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zua.js',
        importUrl: 'http://jwglxt.zua.edu.cn/eams/loginExt.action',
        maintainer: 'xBefore',
        description: '郑州航空工业管理学院树维 EAMS 教务课表导入。请在右上角切换为电脑版后登录教务；若页面显示异常，请手动刷新。登录成功后即可执行导入，无需进入“我的课表”等具体课程页面。支持自动同步学期日期与学校标准作息。'
      }
    ]
  },
  {
    id: 'ZZVCAE',
    name: '郑州汽车工程职业学院',
    initial: 'Z',
    folder: 'ZZVCAE',
    adapters: [
      {
        id: 'zzvcae_01',
        name: '郑州汽车工程职业学院',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zzvcae.js',
        importUrl: 'https://cas.zzvcae.edu.cn/cas/login',
        maintainer: 'Gr11nJ',
        description: '郑州汽车工程职业学院树维 EAMS 教务课表一键导入。本教务禁止从 jw.zzvcae.edu.cn 直接登录，请先在统一身份认证（CAS）页面登录，随后在【服务大厅】→【学生课表查询】打开过课表页面后，点击执行导入。自动同步课程、作息与学期日期（学期日期获取失败时会提示手动输入开学日期）。'
      }
    ]
  },
  {
    id: 'CUG',
    name: '中国地质大学(武汉)',
    initial: 'Z',
    folder: 'CUG',
    adapters: [
      {
        id: 'CUG_01',
        name: '中国地质大学（武汉）正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cug.js',
        importUrl: 'https://sfrz.cug.edu.cn/authserver/login?service=https%3A%2F%2Fi.cug.edu.cn%2Fweb%2F%3FCASLOGIN%3DCASLOGIN',
        maintainer: 'kncatl',
        description: '中国地质大学（武汉）正方教务系统API适配。登录教务系统任意页面即可一键导入，支持学年学期选择、南望山（秋冬/春夏季）与未来城校区作息选择，自动配置开学日期。'
      },
      {
        id: 'CUG_02',
        name: '中国地质大学（武汉）研究生教务',
        category: 'POSTGRADUATE',
        assetJsPath: 'cug_postgraduate.js',
        importUrl: 'https://epo.cug.edu.cn',
        maintainer: 'JiaLiFuNia',
        description: '适配中国地质大学（武汉）研究生教务管理系统。登录教务系统并定位到学期课表页面后点击导入。支持南望山（秋冬/春夏季）与未来城校区作息选择。'
      }
    ]
  },
  {
    id: 'OUC',
    name: '中国海洋大学',
    initial: 'Z',
    folder: 'OUC',
    adapters: [
      {
        id: 'OUC_01',
        name: '中国海洋大学本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ouc_01.js',
        importUrl: 'https://id.ouc.edu.cn/sso/login?service=https%3A%2F%2Fjwgl2024.ouc.edu.cn%2F',
        maintainer: 'anOsprey',
        description: '中国海洋大学本科生教务课程表导入，基于强智教务系统网络请求适配。使用校园网络登录教务系统后，可选择目标学期一键导入课程表，自动读取教学周历获取开学日期与总周数，并对课程进行合并去重；导入时可按需选择崂山/鱼山或西海岸校区的作息时间进行配置。如遇问题可及时反馈'
      }
    ]
  },
  {
    id: 'CJLU',
    name: '中国计量大学',
    initial: 'Z',
    folder: 'CJLU',
    adapters: [
      {
        id: 'CJLU',
        name: '中国计量大学（正方教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cjlu.js',
        importUrl: 'https://jwxt.cjlu.edu.cn/xtgl/login_slogin.html',
        maintainer: 'salt-fishes, ying-ck',
        description: '登录中国计量大学教务系统后即可导入课表，支持选择学年学期，自动获取开学日期与作息时间'
      }
    ]
  },
  {
    id: 'USTC',
    name: '中国科学技术大学',
    initial: 'Z',
    folder: 'USTC',
    adapters: [
      {
        id: 'USTC',
        name: '中国科学技术大学本科教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'ustc.js',
        importUrl: 'https://id.ustc.edu.cn/cas/login?service=https%3A%2F%2Fjw.ustc.edu.cn%2Fucas-sso%2Flogin',
        maintainer: 'Enthusjast',
        description: '中国科学技术大学本科教务系统适配，登录后进入课表查询页面，等待课表加载完成后点击导入'
      },
      {
        id: 'USTC_01',
        name: '中国科学技术大学研究生教务',
        category: 'POSTGRADUATE',
        assetJsPath: 'ustc_01.js',
        importUrl: 'https://yjs1.ustc.edu.cn/gsapp/sys/yjsrzfwapp/dbLogin/main.do',
        maintainer: 'hydrofluoric07',
        description: '中国科学技术大学研究生综合服务平台（yjs1.ustc.edu.cn）适配：登录后进入「培养→课表查询→学生课表查询」页面再执行导入'
      }
    ]
  },
  {
    id: 'CAUC',
    name: '中国民航大学',
    initial: 'Z',
    folder: 'CAUC',
    adapters: [
      {
        id: 'CAUC',
        name: '中国民航大学正方教务',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cauc.js',
        importUrl: 'https://http-jwgl-cauc-edu-cn-80.webvpn.cauc.edu.cn/xtgl/login_slogin.html',
        maintainer: '星河欲转',
        description: '中国民航大学正方教务，webvpn入口，非本校开发者适配如果有误建议提交issues'
      }
    ]
  },
  {
    id: 'CUP',
    name: '中国石油大学(北京)',
    initial: 'Z',
    folder: 'CUP',
    adapters: [
      {
        id: 'CUP_01',
        name: '中国石油大学(北京)本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cup_01.js',
        importUrl: 'https://bk.cup.edu.cn/student/',
        maintainer: 'larryyan',
        description: '点击统一身份认证登录'
      },
      {
        id: 'CUP_02',
        name: '中国石油大学(北京)研究生教务系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'cup_02.js',
        importUrl: 'https://gmis.cup.edu.cn/gmis/student/default/index',
        maintainer: 'larryyan',
        description: '点击统一身份认证登录\n打开(培养管理=>学生课表查询)页面。\n包含克拉玛依校区'
      }
    ]
  },
  {
    id: 'CUPK',
    name: '中国石油大学（北京）克拉玛依校区',
    initial: 'Z',
    folder: 'CUPK',
    adapters: [
      {
        id: 'CUPK_01',
        name: '中国石油大学(北京)克拉玛依校区本科教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'cupk_01.js',
        importUrl: 'https://eams.cupk.edu.cn/student/',
        maintainer: 'ARK-VALLEY',
        description: '登录后直接导入既可，无需进入课表页面，注意登录密码不是融合门户密码，初始密码为个人完整身份证号'
      }
    ]
  },
  {
    id: 'UPC',
    name: '中国石油大学(华东)',
    initial: 'Z',
    folder: 'UPC',
    adapters: [
      {
        id: 'UPC',
        name: '中国石油大学(华东)教务适配',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'upc.js',
        importUrl: 'https://webvpn.upc.edu.cn/users/sign_in',
        maintainer: '星河欲转',
        description: '中国石油大学(华东)强智教务适配,webvpn入口,登录后需要进入教务系统页面才可以点击导入,非本校开发者适配如果有误建议提交issues'
      },
      {
        id: 'UPC_GRAD',
        name: '中国石油大学(华东)研究生综合管理系统',
        category: 'POSTGRADUATE',
        assetJsPath: 'upc_graduate.js',
        importUrl: 'https://degrees.upc.edu.cn/',
        maintainer: 'Haooz',
        description: '中国石油大学(华东)研究生综合管理系统课表导入，登录打开学期课表查询页面，再点击导入！'
      }
    ]
  },
  {
    id: 'CSU',
    name: '中南大学',
    initial: 'Z',
    folder: 'CSU',
    adapters: [
      {
        id: 'CSU_01',
        name: '中南大学（强智教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'csu.js',
        importUrl: 'https://ca.csu.edu.cn/authserver/login?service=http%3A%2F%2Fcsujwc.its.csu.edu.cn%2Fsso.jsp',
        maintainer: 'GaLeKu',
        description: '中南大学强智 jsxsd 教务，本科。统一身份认证登录后自动进入教务系统，登录后在任意教务页面即可导入，学期在 App 内选择。该校按学号把请求分摊到多台服务器，脚本以当前页面所在主机为准，不写死域名。'
      }
    ]
  },
  {
    id: 'CSUFT',
    name: '中南林业科技大学',
    initial: 'Z',
    folder: 'CSUFT',
    adapters: [
      {
        id: 'CSUFT_QZ_01',
        name: '中南林业科技大学（强智教务）',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'csuft.js',
        importUrl: 'https://webvpn.csuft.edu.cn/',
        maintainer: 'jinnianliuxing',
        description: '中南林业科技大学强智教务系统课表导入'
      }
    ]
  },
  {
    id: 'SCUEC',
    name: '中南民族大学',
    initial: 'Z',
    folder: 'SCUEC',
    adapters: [
      {
        id: 'SCUEC',
        name: '中南民族大学教务系统',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'scuec.js',
        importUrl: 'https://webvpn.scuec.edu.cn/',
        maintainer: 'Zellon0w0',
        description: '中南民族大学课程表导入适配 \n\n如果有适配问题请提issue'
      }
    ]
  },
  {
    id: 'SYSU',
    name: '中山大学',
    initial: 'Z',
    folder: 'SYSU',
    adapters: [
      {
        id: 'SYSU',
        name: '中山大学',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'sysu.js',
        importUrl: 'https://jwxt.sysu.edu.cn/',
        maintainer: 'JXCZ',
        description: '中山大学NetID版本教务系统课程表导入,注：先点击右上角切换为电脑模式再登陆，登陆后可直接导入。'
      },
      {
        id: 'SYSU_01',
        name: '中山大学研究生教务课表导入',
        category: 'POSTGRADUATE',
        assetJsPath: 'sysu_01.js',
        importUrl: 'https://cms.sysu.edu.cn/',
        maintainer: 'JR2714',
        description: '中山大学研究生教务(cms.sysu.edu.cn)'
      }
    ]
  },
  {
    id: 'ZHKU',
    name: '仲恺农业工程学院',
    initial: 'Z',
    folder: 'ZHKU',
    adapters: [
      {
        id: 'ZHKU_00',
        name: '强智教务 - 学期理论课表',
        category: 'BACHELOR_AND_ASSOCIATE',
        assetJsPath: 'zhku_lc6464.js',
        importUrl: 'https://edu-admin.zhku.edu.cn/',
        maintainer: 'lc6464',
        description: '便捷导入流程：登录教务系统后点击右下角“执行导入”，在弹窗中选择学年学期即可。\n\n传统导入流程：登录教务系统后在左侧找到“培养管理”->“我的课表”->“学期理论课表”，选择学期后点击右下角“执行导入”即可。\n\n目前仅支持导入“学期理论课表”内任意学期的课表，暂不支持导入其它类型的课表。'
      }
    ]
  }
]
