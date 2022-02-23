"use strict";

// 夜间模式
function dayNightSwitch() {
  // const key = 'nightMode';
  // // 夜晚模式开关
  // const daySwitch = $("#daySwitch");
  // daySwitch.toggleClass("daySwitch");
  // $(document.body).toggleClass("night");
  // if (document.body.classList.contains('night')) {
  //   setLocalStorage(key, true);
  // } else {
  //   setLocalStorage(key, false);
  // }
  const daySwitch = $("#daySwitch");
  daySwitch.toggleClass("daySwitch");
  $(document.body).toggleClass("dark");
}

/**
 * 自动切换夜间模式
 */
function autoDayNight() {
  if (window.matchMedia && window.matchMedia(
    '(prefers-color-scheme: dark)').matches) {
    $("#daySwitch").removeClass("daySwitch");
    $(document.body).addClass("dark");
    $(document.body).addClass("night");
    
  // } else {
  //   $("#daySwitch").addClass("daySwitch");
  //   $(document.body).removeClass("dark");
  }
}

// function checkNightMode() {
//   const isNight = getLocalStorage('nightMode');
//   // 如果已经是夜间模式
//   if (isNight) {
//     const daySwitch = $("#daySwitch");
//     daySwitch.removeClass("daySwitch");
//     $(document.body).addClass("night");
//   }
// }

/**
 * 点击页面处理小屏幕目录事件
 * @param target
 */
function documentClickToc(target) {
  var moonToc = $('#moonToc')
  if (moonToc && moonToc.hasClass('mm-active')) {
    if (target.id && target.id === "moonToc") {
    } else if (target.id && target.id === "moonMenu") {
    } else if (target.id && target.classList.contains('icon-toc')) {
    } else if (target.classList.contains('moon-menu-button')) {
    } else if (target.classList.contains('moon-menu-text')) {
    } else {
      toggleSmallToc()
    }
  }
}


function getHashCode(str, caseSensitive) {
  if (!caseSensitive) {
    str = str.toLowerCase();
  }
  var hash = 1315423911, i, ch;
  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return (hash & 0x7FFFFFFF);
}

/**
 * 处理目录
 */
function dealContentToc() {
  if (getClientWidth() > 1359) {
    initToc();
    scrollTocFixed();
  } else {
    var smallToc = $('.moon-menu-item.icon-toc');
    if (smallToc) {
      smallToc.toggleClass('hidden');
      // 渲染目录
      initMoonToc()
    }

    $(document).click(function (e) {
      var target = e.target;
      documentClickToc(target);
    });
  }
}

/**
 * 处理导航菜单
 */
function handleNavMenu() {
  if (getClientWidth() <= 800) {
    $('#navHeader .nav').addClass('opacity-100').removeClass('opacity-0')
    return;
  }
  if (hideMenu) {
    document.addEventListener('scroll', handleScrollMenu, false);
  }
}

function handleScrollMenu() {

  if (getClientWidth() <= 800) {
    $('#navHeader .nav').addClass('opacity-100').removeClass('opacity-0')
    return;
  }
  const scrollTop = getScrollTop();
  if (scrollTop > 29) {
    $('#navHeader').addClass('nav-bg-fff')
    $('#navHeader .nav').addClass('opacity-100').removeClass('opacity-0')
    $('#navHeader .collapse-nav').hide()
    $('.collapse-burger').removeClass('open');
  } else {
    $('#navHeader').removeClass('nav-bg-fff')
    $('#navHeader .nav').removeClass('opacity-100').addClass('opacity-0')
    $('#navHeader .collapse-nav').show()
  }
}

function collapseNav() {
  const burger = $('.collapse-burger');
  burger.toggleClass('open');
  const nav = $('#navHeader .nav');

  nav.toggleClass('opacity-100')
  if (nav.hasClass('opacity-100')) {
    nav.removeClass('slideOut');
    nav.addClass('slideIn');
  } else {
    nav.addClass('slideOut');
    nav.removeClass('slideIn');
  }
}

/********************************
 *
 *  文章页面相关
 *
 *******************************/

function scrollTocFixed() {
  document.addEventListener("scroll", tocScroll, false);
}

function removeScrollTocFixed() {
  document.removeEventListener('scroll', tocScroll, false);
}

function highlightCode() {
  if (enableLineNumber) {
    $('.md-content  pre>code[class*="language-"]').each(function (i, block) {
      lineNumbersBlock(block);
    });
  }

  if (collpaseCode) {
    $('.md-content  pre>code[class*="language-"]').each(function (i, block) {
      $(block).parent().wrap('<details></details>');
      $(block).parent().before('<summary>code</summary>')
    });
  }


}

//获取滚动条距离顶部位置
function getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

function tocScroll(event) {
  const tocId = "#toc";
  const Obj = $("#tocFlag");

  //判断元素是否存在
  if (Obj.length !== 1) {
    return false;
  }

  const tocFixed = $(tocId);
  const ObjTop = Obj.offset().top - $(window).height() * 0.5;

  // 滚动条离页面顶端的距离
  const scrollTop = getScrollTop();
  const postHeaderHeight = $("#postHeader").height();
  if (scrollTop > postHeaderHeight / 2) {
    tocFixed.show();
  } else {
    tocFixed.hide();
  }

  const tocEle = document.querySelector(tocId);
  if (!tocEle || !tocEle.getBoundingClientRect()) {
    return;
  }
  const tocHeight = tocEle.getBoundingClientRect().height;
  if (scrollTop > ObjTop - tocHeight * 0.5) {
    tocFixed.addClass("toc-right-fixed");
  } else {
    tocFixed.removeClass("toc-right-fixed");
  }

  // 设置目录right
  tocEleRight();

  event.preventDefault();
}

function getClientWidth() {
  return document.body.clientWidth;
}

function initToc() {
  const headerEl = "h1,h2,h3,h4,h5,h6", //headers
    content = ".md-content"; //文章容器
  tocbot.init({
    tocSelector: "#toc",
    contentSelector: content,
    headingSelector: headerEl,
    scrollSmooth: true,
    headingsOffset: 0 - $("#postHeader").height(),
    // scrollSmoothOffset: -80, // 实现点击目录精准跳转到header
    hasInnerContainers: false,
  });

  $('a[class*="node-name--H"]').each(function () {
    // var cls = $(this).getAttribute('class');
    // console.log(cls)
    const linkContent = $(this).html();
    $(this).html(`<span class="toc-link-dot"></span>${linkContent}`);
  });

  // 设置目录right
  tocEleRight();
}

function tocEleRight() {
  const screenWidth = getClientWidth();
  const tocEle = document.getElementById("toc");
  if (tocEle) {
    tocEle.style.left = (screenWidth - 800) / 2 + 820 + "px";
  }
}

function toggleAliPay() {
  $(".qrcode-wechat").addClass("hidden");
  $(".qrcode-alipay").toggleClass("hidden");
  $("#wechat i").removeClass("active-bg");
  $("#alipay i").toggleClass("active-bg");
}

function toggleWeChat() {
  $(".qrcode-alipay").addClass("hidden");
  $(".qrcode-wechat").toggleClass("hidden");
  $("#alipay i").removeClass("active-bg");
  $("#wechat i").toggleClass("active-bg");
}

function scollTo() {
  const postHeight = $("#homeHeader").height();
  window.scroll({top: postHeight, behavior: "smooth"});
}

function generateId() {
  const chars = `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz`;
  let id = ``;
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function getBilibili(width, height, id) {
  return `<iframe width="${width}" height="${height}" src="//player.bilibili.com/player.html?aid=${id}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`
}

function getWangYiMusic(id) {
  return `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=110 src="//music.163.com/outchain/player?type=0&id=${id}&auto=1&height=90"></iframe>`
}

const wangyi = /\[music:\s*\d+\s*\]/g;

const bilibili = /\[bilibili:\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]/g;

const blockReg = /\${2}([\s\S]*?)\${2}/g;
const inlineReg = /\$([\s\S]*?)\$/g;

/**
 * 格式化公式
 */
function formatMath(kateBlock, isBlock) {
  // 这一步很重要，需要把 &amp; 换成 &
  let block = kateBlock.replaceAll("&amp;", "&");
  if (block.length < 3) {
    return;
  }
  const len = isBlock ? 2 : 1;
  block = block.substring(len, block.length - len);
  const html = katex.renderToString(block, {
    throwOnError: false,
    leqno: true,
    fleqn: true,
  });
  return isBlock ? `<div style="text-align: center; margin: 1rem auto;">${html}</div>` : html;
}

/**
 * 处理公式
 */
function dealMathx(content) {
  if (openKatex) {
    const kateBlocks = content.match(blockReg);
    if (kateBlocks && kateBlocks.length > 0) {
      for (let i = 0; i < kateBlocks.length; i++) {
        content = content.replace(kateBlocks[i], formatMath(kateBlocks[i], true));
      }
    }
    const kateInlines = content.match(inlineReg);
    if (kateInlines && kateInlines.length > 0) {
      for (let i = 0; i < kateInlines.length; i++) {
        content = content.replace(kateInlines[i], formatMath(kateInlines[i], false));
      }
    }
  }
  return content;
}

/**
 * 将文本转成 markdown
 */
function formatContent() {
  let mdContent = document.getElementById("original");
  const persentContent = $("#write");
  if (!mdContent || !persentContent) {
    return;
  }
  // 获取原始html
  let originalContent = mdContent.innerHTML;

  if (typeof originalContent === "undefined") {
    return false;
  }
  // 反转义原始markdown文本
  originalContent = HTMLDecode(originalContent);
  // 处理公式， 这是主要是因为 \\ 的原因
  // originalContent = dealMathx(originalContent);
  persentContent.empty();
  persentContent.addClass("loading");

  const renderer = new marked.Renderer();

  renderer.heading = function (text, level, raw, slugger) {
    return `<h${level} id=${generateId()}>${text}</h${level}>`;
  };

  renderer.paragraph = function (text) {
    // 渲染网易云音乐
    const musics = text.match(wangyi);
    if (musics && musics.length > 0) {
      for (let i = 0; i < musics.length; i++) {
        const wangyiMusic = musics[i].match(/\d+/);
        if (wangyiMusic && wangyiMusic.length > 0) {
          const id = wangyiMusic[0];
          text = text.replace(musics[i], getWangYiMusic(id));
        }
      }
    }

    // 渲染bilibili视频
    const videos = text.match(bilibili);
    if (videos && videos.length > 0) {
      for (let j = 0; j < videos.length; j++) {
        const video = videos[j].match(/\d+/g);
        if (video && video.length > 0 && video.length === 3) {
          const aid = video[0], width = video[1], height = video[2];
          text = text.replace(videos[j], getBilibili(width, height, aid));
        }
      }
    }
    return `<p>${text}</p>`;
  };

  renderer.link = function (href, title, text) {
    if (href && href.startsWith('#')) {
      return `<a href="${href}" rel="noopener noreferrer">${text}</a>`;
    }
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  renderer.image = function (href, title, text) {
    const reg = /([^]*)\[([^]*)\]\(([^]*)\)/;
    const isContainUrl = reg.test(text);
    const imgHtml = `<img class="lazyload" src=${loading} data-src=${href} alt=${text}>`;
    return `<span style="text-align: center;">
              ${
      isContainUrl
        ? getImgWithUrlHtml(text.match(reg), href)
        : imgHtml
    }
            </span>`;
  };

  function getImgWithUrlHtml(textArr, href) {
    return `<img class="lazyload" src=${loading} data-src=${href} alt=${textArr[2]}></a>`;
  }

  renderer.listitem = function (text, task) {
    if (task) {
      return `<li style="list-style: none;">${text}</li>`;
    }
    return `<li>${text}</li>`;
  };

  renderer.blockquote = function (text) {
    text = text.trim();
    // 去掉换行符
    text = text.replace(/[\r\n]/g, "<br/>");
    text = text.replace(/<p>/g, "");
    text = text.replace(/<\/p>/g, "<br>");
    const textArr = text.split("<br>");
    const context = [];
    for (let i = 0; i < textArr.length; i++) {
      if (textArr[i].trim().length === 0) {
        continue;
      }
      let txt = textArr[i].replace(/<br\/>/g, '')
      txt = txt.replace(/<br>/g, '')
      context.push(`<p>${txt}</p>`);
    }
    return `<blockquote>${context.join("")}</blockquote>`;
  };

  renderer.table = function (header, body) {
    if (body) {
      body = "<tbody>" + body + "</tbody>";
    }

    return (
      '<div class="md-table"><table>\n' +
      "<thead>\n" +
      header +
      "</thead>\n" +
      body +
      "</table></div>\n"
    );
  };

  marked.setOptions({
    renderer: renderer,
    highlight: function (code, language) {
      if (enableCodeHighlight) {
        const validLanguage = hljs.getLanguage(language)
          ? language
          : "plaintext";
        return hljs.highlight(validLanguage, code).value;
      }
      return code;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
  });

  persentContent.empty();
  persentContent.removeClass("loading");
  persentContent.html(marked.parse(originalContent.trim()));

  mdContent.remove();
  mdContent = null;
  // 代码行号
  highlightCode();

  // 相册
  gallery()

  // 数学公式
  renderMath();

  // 图片懒加载
  // lazyloadImg();
  return true;
}

/**
 * 反转义 HTML
 * @param text
 * @returns {*}
 * @constructor
 */
function HTMLDecode(text) {
  const arrEntities = {lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"'};
  return text.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
}

/*******************************
 * 右下角按钮相关
 */
function smoothBack2Top() {
  window.scroll({top: 0, behavior: 'smooth'});
}

function smoothBack2Bottom() {
  const offsetHeight = document.documentElement.offsetHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  window.scroll({top: scrollHeight - offsetHeight, behavior: 'smooth'});
}

function ckBack2Top() {
  $('#moonToc').removeClass('mm-active');
  smoothBack2Top();
}

function ckBack2Bottom() {
  $('#moonToc').removeClass('mm-active');
  smoothBack2Bottom();
}

function ckShowContent() {
  toggleSmallToc()

  // 模拟点击事件
  $('.moon-menu-button').trigger("click");
}

function toggleSmallToc() {
  var moonContent = $('#moonToc')
  moonContent.toggleClass('mm-active');

  if (moonContent.hasClass('mm-active')) {
    moonContent.show();
  } else {
    moonContent.hide()
  }
}

function initMoonToc() {
  var headerEl = 'h1,h2,h3,h4,h5,h6',  //headers
    content = '.md-content';//文章容器
  tocbot.init({
    tocSelector: '#moonToc',
    contentSelector: content,
    headingSelector: headerEl,
    scrollSmooth: true,
    isCollapsedClass: '',
    headingsOffset: 0 - ($('#postHeader').height() + 58),
    scrollSmoothOffset: -60,
    hasInnerContainers: false,
  });

  var moonToc = $('#moonToc');
  // 没有生成目录
  if (moonToc && moonToc.children().length === 0) {
    $('.icon-toc').addClass('hidden');
  }
}

function toggleSearchBox() {
  $('#searchBox').toggleClass('hidden');
}

function toggleCircle() {
  var $moonDot = $('g.moon-dot');
  var firstCircle = $moonDot.children('circle:first');
  var lastCircle = $moonDot.children('circle:last');
  var cy = $(firstCircle).attr('cy');
  if (cy === '0') {
    $(firstCircle).attr('cx', '0');
    $(firstCircle).attr('cy', '-.8rem');
    $(lastCircle).attr('cx', '0');
    $(lastCircle).attr('cy', '.8rem');
  } else {
    $(firstCircle).attr('cx', '-.8rem');
    $(firstCircle).attr('cy', '0');
    $(lastCircle).attr('cx', '.8rem');
    $(lastCircle).attr('cy', '0');
  }
}

function ckMoonButton() {
  // 右下角的小点
  toggleCircle();
  $('.moon-menu-items').toggleClass('item-ani');
}

/**
 * 异步获取分页数据
 * @param  e
 */
function getData(e) {
  const path = $(e).attr("path");
  var pageContainer = "#pageContainer";
  $.ajax({
    type: "GET",
    url: path,
    beforeSend: function () {
      $(pageContainer).empty();
      $(pageContainer).addClass("loading");
    },
    success: function (data) {
      $(pageContainer).removeClass("loading");
      $(pageContainer).empty();
      let result = $(data).find(pageContainer);
      $(pageContainer).append(result.children());
      let page = "#pagination";
      let pagination = $(data).find(page);
      $(page).empty();
      $(page).append(pagination.children());
      lazyloadImg();
      if ($(data).find(".ziyan")) {
        // 计算时间
        setTimeAgo();

        // 自言代码高亮
        hljsZiYanCode()

      }
    },
    error: function () {
      $(pageContainer).empty();
      $(pageContainer).addClass("loading");
    },
  });
}

function likeJournal(e) {
  if ($(e).hasClass('liked')) {
    return;
  }
  const path = $(e).data('path')
  $.ajax({
    type: "post",
    url: path,
    data: "{}",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      $(e).addClass('liked')
      $(e).removeAttr('onclick');
      var count = $(e).siblings('.is-reaction-count')
      var likeCount = parseInt(count.html())
      $(e).siblings('.is-reaction-count').html(likeCount + 1);
    },
    error: function (msg) {
    }
  })
}

function commentJournal(e) {

}

/**
 * 自言查看更多
 * @param e
 */
function getMore(e) {
  const path = $(e).attr("path");
  var moreContainer = "#moreContainer";
  var moreLoading = '#pagination';
  $.ajax({
    type: "GET",
    url: path,
    beforeSend: function () {
      $(moreLoading).empty();
      $(moreLoading).addClass("loading");
    },
    success: function (data) {
      $(moreLoading).removeClass("loading");
      $(moreLoading).empty();
      let result = $(data).find(moreContainer);
      $(moreContainer).append(result.children());
      let page = "#pagination";
      let pagination = $(data).find(page);
      $(page).empty();
      $(page).append(pagination.children());
      if ($(data).find(".ziyan")) {
        // 计算时间
        setTimeAgo();

        // 自言代码高亮
        hljsZiYanCode()
      }
    },
  });
}

/**
 * 渲染数学公式
 */
const katexConfig = {
  leqno: true,
  delimiters: [
    {left: "$$", right: "$$", display: true},
    {left: "$", right: "$", display: false},
    {left: "\\(", right: "\\)", display: false},
    {left: "\\[", right: "\\]", display: true}
  ]
}
/**
 * 渲染数学公式
 */
// function renderMath() {
//   if (openKatex && renderMathInElement && typeof renderMathInElement
//     !== 'undefined') {
//     if (document.getElementById('write')) {
//       renderMathInElement(document.getElementById('write'), katexConfig);
//     } else if (document.getElementById('ziyan')) {
//       renderMathInElement(document.getElementById('ziyan'), katexConfig);
//     }
//   }
// }

/**
 * 懒加载图片
 */
function lazyloadImg() {
  const imgs = document.querySelectorAll('img.lazyload');
  const randomImgs = document.querySelectorAll('img.img-random');

  //用来判断bound.top<=clientHeight的函数，返回一个bool值
  function isIn(el) {
    const bound = el.getBoundingClientRect();
    const clientHeight = window.innerHeight;
    return bound.top <= clientHeight;
  }

  //检查图片是否在可视区内，如果不在，则加载
  function check() {
    Array.from(imgs).forEach(function (el) {
      if (isIn(el)) {
        loadImg(el);
      }
    })

    Array.from(randomImgs).forEach(function (el) {
      if (isIn(el)) {
        loadRandomImgs(el);
      }
    })
  }

  function loadImg(el) {
    const loaded = el.getAttribute('data-loaded')
    if (!loaded) {
      el.src = el.dataset.src;
      el.setAttribute('data-loaded', true)
    }
  }

  function loadRandomImgs(el) {
    const loaded = el.getAttribute('data-loaded')
    if (!loaded) {
      var index = el.getAttribute('index');
      var imgIndex = !index ? new Date().getSeconds() : index;
      if (el.classList.contains('img-random') && typeof photos !== 'undefined' && photos.length > 0) {
        el.src = photos[imgIndex % photos.length];
      }
      el.setAttribute('data-loaded', true)
    }
  }

  check();
  window.onload = window.onscroll = function () { //onscroll()在滚动条滚动的时候触发
    check();
  }
}

/**
 * 计算时间
 * @param time
 * @returns {string|*}
 */
function timeAgo(time) {
  const currentTime = new Date().getTime();
  const between = currentTime - time;
  const days = Math.floor(between / (24 * 3600 * 1000));
  if (days === 0) {
    const leave1 = between % (24 * 3600 * 1000);
    const hours = Math.floor(leave1 / (3600 * 1000));
    if (hours === 0) {
      const leave2 = leave1 % (3600 * 1000);
      const minutes = Math.floor(leave2 / (60 * 1000));
      if (minutes === 0) {
        const leave3 = leave2 % (60 * 1000);
        const seconds = Math.round(leave3 / 1000);
        return seconds + ' 秒前'
      }
      return minutes + ' 分钟前'
    }
    return hours + ' 小时前'
  }
  if (days < 0) {
    return '刚刚'
  }
  if (days < 1) {
    return days + ' 天前'
  } else {
    return formatDate(time, 'yyyy/MM/dd hh:mm');
  }
}

/**
 * 格式化时间
 * @param date
 * @param fmt
 * @returns {*}
 */
function formatDate(date, fmt) {
  date = new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1,
        (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

/**
 *
 * @param str
 * @returns {string}
 */
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

/**
 * 设置时间
 */
function setTimeAgo() {
  $('.time-ago').each(function () {
    const time = $(this).attr('time');
    const timeStr = timeAgo(new Date(time));
    $(this).html(timeStr);
  });
}

/**
 * 自言代码高亮
 */
function hljsZiYanCode() {
  $('.ziyan .md-content pre code').each(function () {
    hljs.highlightBlock(this);
  });
}

/**
 * 获取本地
 * @param key
 * @returns {null|*}
 */
function getLocalStorage(key) {
  var exp = 60 * 60 * 1000; // 一个小时的秒数
  if (localStorage.getItem(key)) {
    var vals = localStorage.getItem(key); // 获取本地存储的值
    var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
    // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
    var isTimed = (new Date().getTime() - dataObj.timer) > exp;
    if (isTimed) {
      console.log("存储已过期");
      localStorage.removeItem(key);
      return null;
    } else {
      var newValue = dataObj.val;
    }
    return newValue;
  } else {
    return null;
  }
}

function isQuotaExceeded(e) {
  var quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014: // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) { // IE8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;

}

function setLocalStorage(key, value) {
  var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
  var valueDate = JSON.stringify({
    val: value,
    timer: curtime
  });
  try {
    localStorage.removeItem(key)
    localStorage.setItem(key, valueDate);
  } catch (e) {
    // 兼容性写法
    if (isQuotaExceeded(e)) {
      console.log("Error: 本地存储超过限制");
      localStorage.clear();
    } else {
      console.log("Error: 保存到本地存储失败");
    }
  }
}

// 相册页面
function gallery() {

  const $photoPage = $(".photos-page");
  // 判断当前是否为图库界面
  if ($photoPage.length < 1) {
    return;
  }
  // 渲染图库信息
  const $masonrys = $(".masonry-gallery.gallery");

  const option = {
    masonry: {
      gutter: 10,
    },
    // layoutMode: 'masonry',
    // sortBy: 'name',
    // percentPosition: true,
    itemSelector: ".gallery-item",
  };
  $masonrys.find("img.lazyload").on('load', function () {
    $masonrys.isotope(option);
  })

  $("#gallery-filter li a").on("click", function () {
    $("#gallery-filter li a").removeClass("active");
    $(this).addClass("active");
    var dataFilter = $(this).data("filter");
    $masonrys.isotope({
      filter: dataFilter,
    });
    return false;
  });
}

function highLightCode() {
  document.querySelectorAll('pre code').forEach((el) => {
    // 在页面上显示这个代码块的语言
    var cls = el.getAttribute('class');
    if (cls !== undefined && cls !== null) {
      var langs = cls.split(' ');
      if (langs !== undefined && langs !== null) {
        el.setAttribute('data-language', langs[0].replace('language-', ''))
      }
    }
    hljs.highlightBlock(el);
  });
}

function setCodeLineNumber() {
  $('.md-content  pre>code[class*="language-"]').each(function (i, block) {
    lineNumbersBlock(block);
  });
}


function toBigImg() {
  $(".opacityBottom").addClass("opacityBottom");//添加遮罩层
  $(".opacityBottom").show();
  $("html,body").addClass("none-scroll");//下层不可滑动
  $(".bigImg").addClass("bigImg");//添加图片样式
  $(".opacityBottom").click(function () {//点击关闭
    $("html,body").removeClass("none-scroll");
    $(".opacityBottom").remove();
  });
}

function clickToZoomImg() {
  $('img').click(function () {
    //获取图片路径
    var imgsrc = $(this).attr("src");
    var opacityBottom = '<div class="opacityBottom" style = "display:none"><img class="bigImg" src="' + imgsrc + '"></div>';
    $(document.body).append(opacityBottom);
    toBigImg();//变大函数
  });
}


$(function () {
  // 点击方法图片
  clickToZoomImg();

  autoDayNight();

  // 检查黑夜模式
  // checkNightMode()

  // 自动切换夜间模式
  // if (autoNightMode) {
  //   autoDayNight();
  // }

  // 处理导航菜单
  handleNavMenu();

  // 处理目录
  dealContentToc()

  // 高亮代码
  highLightCode()

  // 设置代码行号
  setCodeLineNumber()

  // 相册
  gallery()

  // 图片懒加载
  lazyloadImg();

  if ($('#container').find('.ziyan').length > 0) {
    // // 计算时间
    // setTimeAgo();

    // 自言代码高亮
    hljsZiYanCode()
  }
});
