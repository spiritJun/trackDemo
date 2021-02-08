// 实现金额数目千分位显示
export function getThousandNum(num) {
    if (num === 0) {
      return 0;
    }
    if (num) {
      return num.toString().replace(/\d+/, function(n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
          // 对整数部分添加分隔符
          return $1 + ",";
        });
      });
    } else {
      return "";
    }
  }
  // 金额的列设置padding
  export function tableCellClassName({ column }) {
    if (column.align === "is-right") {
      return "padding-right";
    }
  }
  /**
 * arr转obj
 */
export function arr2obj(arrData) {
    const objData = arrData.reduce((acc, cur) => {
      acc[cur.typecode] = cur.typename;
      return acc;
    }, {});
    return objData;
  }

/**
 * 获取url中的参数
 * @param {*} name:参数名
 * @param {*} url 
 */
export function getUrlKey(name, url) {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(url) || [
        "",
        "",
      ])[1].replace(/\+/g, "%20")
    ) || null
  );
}

//日期格式(时间戳转时间)
export function formatDateTime(timenumber, format) {
  if (
    timenumber === undefined ||
    timenumber == null ||
    timenumber === "" ||
    isNaN(timenumber)
  ) {
    return "INVAILED";
  }
  let adate = new Date(timenumber);
  let year = adate.getFullYear().toString();
  let month = (adate.getMonth() + 1).toString();
  let thedate = adate.getDate().toString();
  let hour = adate.getHours().toString();
  let minute = adate.getMinutes().toString();
  let second = adate.getSeconds().toString();
  month = month.length === 1 ? "0" + month : month;
  thedate = thedate.length === 1 ? "0" + thedate : thedate;
  hour = hour.length === 1 ? "0" + hour : hour;
  minute = minute.length === 1 ? "0" + minute : minute;
  second = second.length === 1 ? "0" + second : second;
  let YMD = year + "-" + month + "-" + thedate;
  let HMS = hour + ":" + minute + ":" + second;
  let HM = hour + ":" + minute;
  let YMD2 = year + "/" + month + "/" + thedate;
  let YMD3 =
    year + "年" + month + "月" + thedate + "日" + hour + " : " + minute;
  switch (format) {
    case "Y-M-D":
      return YMD;
    case "Y/M/D":
      return YMD2;
    case "H:M:S":
      return HMS;
    case "H:M":
      return HM;
    case "Y-M-D H:M:S":
      return YMD + " " + HMS;
    case "Y/M/D H:M:S":
      return YMD2 + " " + HMS;
    case "Y/M/D/H/M":
      return YMD3;
    case "Y-M-D H:M":
      return YMD + " " + HM;
    case "Y/M/D H:M":
      return YMD2 + " " + HM;
    default:
      return YMD + " " + HMS;
  }
}

// 当时间选择器的input框失去焦点时判断日期不能小于申请时间
export function checkTime(createTime, deadTime, startTimeObj, endTimeObj) {
  const dateStrat = new Date(createTime);
  const dateEnd = new Date(deadTime);
  if (dateStrat.getTime()) {
    let newTime = new Date(createTime).setSeconds(dateStrat.getSeconds() + 1);
    newTime = formatDateTime(newTime, "Y-M-D H:M:S");
    const timeStart = newTime.split(" ")[1];
    this[endTimeObj] = {
      disabledDate(time) {
        return (
          time.getTime() <= new Date(createTime).getTime() - 1000 * 3600 * 24
        );
      },
    };
  } else {
    this[endTimeObj] = {
      disabledDate(time) {
        return "";
      },
      selectableRange: "00:00:00 - 23:59:59",
    };
  }
  if (dateEnd.getTime()) {
    let newTime = new Date(deadTime).setSeconds(dateEnd.getSeconds() - 1);
    newTime = formatDateTime(newTime, "Y-M-D H:M:S");
    const timeEnd = newTime.split(" ")[1];
    this[startTimeObj] = {
      disabledDate(time) {
        return time.getTime() > new Date(deadTime).getTime();
      },
    };
  } else {
    this[startTimeObj] = {
      disabledDate(time) {
        return "";
      },
      selectableRange: "00:00:00 - 23:59:59",
    };
  }
}
/* 读取数据 */
export function getStorage (key) {
  return window.sessionStorage.getItem(key);
}
/* 设置数据 */
export function setStorage (key, val) {
  window.sessionStorage.setItem(key, val);
}
/*清除数据 */
export function clearStorage (key) {
  window.sessionStorage.removeItem(key);
}
//重置URL
export function resetUrl () {
  let url = window.location.href;
  let index = url.indexOf("?");
  index > 0 && (url = url.slice(0, index));
  window.history.replaceState(null, "", url);
}