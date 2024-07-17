import { isArray } from './is';

export function preciseStringLength(str: string) {
  // 通过unicode计算字符串的精确长度
  if (typeof str !== 'string') {
    throw Error('Parameters must be a string');
  }
  return str.replace(/([^x00-xff])/g, 'rr').length;
}

export function preciseSubstr(s: string, n: number) {
  // 精确截断 通过unicode来截断
  return s
    .slice(0, n)
    .replace(/([^x00-xff])/g, '$1a')
    .slice(0, n)
    .replace(/([^x00-xff])a/g, '$1');
}

export function formatSeconds(second_time: number) {
  // 时间格式化为秒数

  let time = parseInt(second_time) + '秒';
  if (parseInt(second_time) > 60) {
    const second = parseInt(second_time) % 60;
    let min = parseInt(second_time / 60);
    time = min + '分' + second + '秒';

    if (min > 60) {
      min = parseInt(second_time / 60) % 60;
      let hour = parseInt(parseInt(second_time / 60) / 60);
      time = hour + '小时' + min + '分' + second + '秒';

      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        const day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        time = day + '天' + hour + '小时' + min + '分' + second + '秒';
      }
    }
  }

  return time;
}

// 将科学计数法转换为小数
export function toNonExponential(val: any) {
  const num = Number.parseFloat(val);
  const m: any = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

// export function filter(val) {
//   if (Number.isInteger(val * 1)) {
//     return 'id';
//   }
//   if (val.startsWith('bcb')) {
//     return 'address';
//   } else {
//     return 'name';
//   }
// }

/**
 * js缓动函数
 * @export
 * @param {Number} currentY
 * @param {Number} targetY
 */
export function scrollAnimation(currentY: number, targetY: number) {
  // 计算需要移动的距离
  const needScrollTop = targetY - currentY;
  let _currentY = currentY;
  setTimeout(() => {
    // 一次调用滑动帧数
    const dist = Math.ceil(needScrollTop / 10);
    _currentY += dist;
    window.scrollTo(0, currentY);
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(_currentY, targetY);
    } else {
      window.scrollTo(0, targetY);
    }
  }, 1);
}

/**
 * 跳转到指定锚点
 * @export
 * @param {String} domStr ： DOM('.class' , '#id' ,'div')
 * @returns void;
 */
export function linkto(domStr: string) {
  if (!domStr) {
    return;
  }
  if (!('scrollTo' in window)) {
    location.href = domStr;
    return;
  }
  const dom: any = document.querySelector(domStr);
  if (typeof window.getComputedStyle(document.body).scrollBehavior == 'undefined') {
    // 处理scrollIntoView不支持object浏览器向下兼容处理
    const targetY = dom?.offsetTop;
    const currentY = document.documentElement.scrollTop || document.body.scrollTop;
    scrollAnimation(currentY, targetY);
    return;
  }
  if (!dom) {
    return;
  }
  dom.scrollIntoView({
    // 兼容到IE6
    behavior: 'smooth',
    block: 'start',
  });
}

export function filterCong(val: number) {
  return val / 10e8;
}

/**
 * @name 获取url中的转为Obj
 * @param {String} str
 * @returns getQuery('?name=jiawei&age=18') => { ?name: "jiawei", age: "18" }
 */
export function getQuery(str: string) {
  // url转obj
  if (!str) {
    str = location.search.substring(1);
  }
  const query_scan = str
    ? JSON.parse(
        '{"' + str.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) {
          return key === '' ? value : decodeURIComponent(value);
        },
      )
    : {};
  return query_scan;
}

/**
 * @name Obj 转url
 * @param {Object} param
 * @param {String} key
 * @param {Boolean} encode
 * @returns if(param Type is Object) return "&code=111&name=jiawei"
 * @returns urlEncode('jiawei','name') => "&name=jiawei"
 * @returns urlEncode( {name:'jiawei'} ) => "&name=jiawei"
 */
export function urlEncode(param: any, key: string, encode: boolean) {
  // obj转url
  if (param == null) {
    return '';
  }
  let paramStr = '';
  const t = typeof param;
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (const i in param) {
      const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

/**
 * @name 判断元素是否进入可视区域
 * @returns Boolean
 */
export function isInViewPortOfTwo(el: Element) {
  const viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
  return top <= viewPortHeight + 100;
}

/**
 * @name 获取浏览器设备信息
 * @returns Object
 */
export function getBrowser() {
  /* eslint-disable no-useless-escape */
  const UA = navigator.userAgent.toLocaleLowerCase() || '';
  const isAndroid = UA.match(/Android/i) ? true : false;
  const isQQ =
    /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(UA) ||
    /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(UA);
  const isIOS = UA.match(/iPhone|iPad|iPod/i) ? true : false;
  const isIpone = UA.indexOf('iphone') > -1 ? true : false;
  const isSafari = /iPhone|iPad|iPod\/([\w.]+).*(safari).*/i.test(UA);
  // 微信
  const isWx = UA.match(/micromessenger/i) ? true : false;
  // 微博
  const isWb = UA.match(/weibo/i) ? true : false;
  const isAndroidChrome =
    (UA.match(/Chrome\/([\d.]+)/) || UA.match(/CriOS\/([\d.]+)/)) && isAndroid && !isQQ;
  // qq空间
  const isQZ = UA.indexOf('Qzone/') !== -1;
  /* eslint-enable no-useless-escape */
  return {
    isAndroid,
    isQQ,
    isIOS,
    isSafari,
    isWx,
    isWb,
    isAndroidChrome,
    isQZ,
    isIpone,
  };
}

// fn是我们需要包装的事件回调, delay是时间间隔的阈值
export function throttle(fn: any, delay: number) {
  // last为上一次触发回调的时间, timer是定时器
  let last: any = 0,
    timer: any = null;
  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    // 保留调用时传入的参数
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // 记录本次触发回调的时间
    const now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now;
      fn.apply(context, args);
    }
  };
}

// 设置cookie
export function setCookie(cName: string, value: any, expiredays: string | number) {
  if (expiredays > 0 && expiredays !== '100') {
    const exdate: any = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      cName +
      '=' +
      escape(value) +
      // (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
      (expiredays == null ? '' : ';expires=' + exdate.toUTCString());
  }
  if (expiredays === '100') {
    const exdate = new Date('2118-01-01 00:00:00');
    document.cookie =
      cName +
      '=' +
      escape(value) +
      // (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
      (expiredays == null ? '' : ';expires=' + exdate.toUTCString());
  }
}
// 获取cookie
export function getCookie(cName: string) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=');
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1;
      let cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) cEnd = document.cookie.length;
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return '';
}
// 删除cookie
export function delCookie(name: string) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null)
    // document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString();
}
//清除cookie
export function clearCookie(name: string) {
  setCookie(name, '', -1);
}
//获取页面顶部被卷起来的高度
export function getScrollTop() {
  return Math.max(
    //chrome
    document.body.scrollTop,
    //firefox/IE
    document.documentElement.scrollTop,
  );
}
//获取页面文档的总高度
export function getDocumentHeight() {
  //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
//页面浏览器视口的高度
export function getWindowHeight() {
  return document.compatMode === 'CSS1Compat'
    ? document.documentElement.clientHeight
    : document.body.clientHeight;
}
// 时间 格式化成 2018-12-12 12:12:00
export function timestampToTime(timestamp: number, dayMinSecFlag: any) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  if (!dayMinSecFlag) {
    return Y + M + D;
  }
  return Y + M + D + h + m + s;
}

// 删除对象的值为空的属性(不递归判断嵌套对象)
export function removeObjectEmptyItem(obj: any) {
  Object.keys(obj).forEach((key) => (obj[key] === null || obj[key] === '') && delete obj[key]);
  return obj;
}

// 删除对象的值为空的属性(递归嵌套对象)
export function removeObjectEmptyItemNesting(obj: any) {
  Object.keys(obj).forEach(function (key) {
    if (obj[key] && typeof obj[key] === 'object') removeObjectEmptyItemNesting(obj[key]);
    else if (obj[key] === null || obj[key] === '') delete obj[key];
  });
  return obj;
}

export function isNumber(num: any) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-|\+)?\d+(\.\d+)?$/;
  if (reg.test(num)) {
    return true;
  }
  return false;
}

export function objToQuery(obj: any) {
  let query = '?';
  if (typeof obj === 'object') {
    for (const key in obj) {
      query += key + '=' + obj[key] + '&';
    }
  }
  return query.slice(0, -1);
}

// 去重对象里的数组
export function filterOutDuplicatesByObject(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (isArray(obj[key])) {
      obj[key] = [...new Set(obj[key])];
    } else {
      // obj[key] = obj[key];
    }
  });
  return obj;
}

export function mergeObjectArrayToObject(
  list: any,
  filterOutDuplicates?: boolean, // 数组是否去重
  mandatoryArray?: boolean, // 即使只有1个元素也返回数组格式 否则 直接返回当前值
) {
  const mergedObject = list.reduce(
    // target: 目录对象, item: 当前遍历到的元素（对象）
    (target, item) => ({
      // 先将目录对象已经取得的值全部赋予新目录对象
      ...target,
      // 拿到 item 的 key 列表，并且通过该列表去创建一个新的对象
      ...Object.keys(item).reduce(
        // 新的对象，以及 item 中的一个 key
        (object, key) => ({
          // 新对象先把已有的属性全部加上
          ...object,
          // 设定当前的 key 对应的值
          [key]: Array.isArray(target[key])
            ? target[key].concat(item[key]) // 如果当前的 key 在 target[key] 中是数组，则表示已经存在超过两个具有该 key 的对象了，所以直接将新值  concat 进去即可
            : // : target[key] // 否则的话，判断 target[key] 上面是否已经存在该值了
              Object.prototype.hasOwnProperty.call(target, key)
              ? // target.hasOwnProperty(key) // 更新一下，需要拿 `hasOwnProperty` 判断，否则如果值为 0, false, undefined 等，都会被判错
                [target[key], item[key]] // 如果存在了该值，则将该值变成一个数组（因为已经有两个了）
              : mandatoryArray
                ? [item[key]]
                : item[key], // 否则的话，就把当前这个值赋值给 target / 也可组成数组返回
        }),
        {},
      ),
    }),
    {},
  );

  // 简写
  // const mergedObject = list.reduce(
  //   (acc, cur) => (Object.entries(cur).forEach(([key, val]) => (acc[key] ||= []).push(val)), acc),
  //   {},
  // );

  if (filterOutDuplicates) {
    return filterOutDuplicatesByObject(mergedObject);
  } else {
    return mergedObject;
  }
}

// 获取匹配id的节点的name（树，递归）
export function getTreeName(list, id) {
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (a.id === id) {
      return a.name;
    } else {
      if (a.children && a.children.length > 0) {
        const res = getTreeName(a.children, id);
        if (res) {
          return res;
        }
      }
    }
  }
}
