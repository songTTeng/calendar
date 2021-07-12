function base64ToBit(base64Str) {
  const base64CodeMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const result = [];
  for (let i = 0; i < base64Str.length; i++) {
      let n = base64CodeMap.indexOf(base64Str[i]);
      result.push(n.toString(2).padStart(6, '0'));
  }
  return result.join('');
}

function checkDate(year, month, date) {
  if (year < 1901 || year > 2100) {
      throw new Error('Invalid Year');
  }
  if (month < 1 || month > 12) {
      throw new Error('Invalid Month');
  }
  if (date < 1 || date > 31) {
      throw new Error('Invalid Date');
  }
  if ([4, 6, 9, 11].indexOf(month) != -1 && date > 30) {
      throw new Error('Invalid Date');
  }
  if (month == 2) {
      if (date > 29) {
          throw new Error('Invalid Date');
      } else {
          let isLeap = false;
          if (year % 400 == 0) {
              isLeap = true
          } else if (year % 4 == 0 && year % 100 != 0) {
              isLeap = true;
          }
          if (!isLeap && date > 28) {
              throw new Error('Invalid Date');
          }
      }
  }
}

// 2bit代表日期 共48bit
// 48bit -> base64  8个
// 200年一共68种情况
const names = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种',
    '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
const baseDate = [4, 19, 3, 18, 4, 19, 4, 19, 4, 20, 4, 20, 6, 22, 6, 22, 6, 22, 7, 22, 6, 21, 6, 21];
const table = [];
function decompressData() {
    const codeStr = 'ABCDAECDAECDFGHIJKHILKMILABNOABNOAENOAENOAEPQRGSTUGSTLAVTOAWXOAWXOAYXOAYZOabcdebcQUfgThijkOilXOimXOimXOimcOnocdpqcQrsgktujkvumXvumXvumcvumcvwocxyqcz0sj10s213u243um43um53wm56wq567q589s+/0s~/3u~!3u@#3um';
    const groupsStr = 'paaqmqqpqaquqqqqqvruruqq6qWaWZqlqaqqqqqqlaaqmqqppaaqqqqqqrququqqqqWaWZaVlaaampqlpaaqqqqplaWampqlqaququqqqqWZWZVVlaWaWZqlqqVZWZVVlaWaWZaVlaaqmpqpqmVZVZVVVaWaWZaVlaWampqpqlVZVZVVqVVZVVVVVaWZWZVVqVVVVVVVVaVZWZVVpaaqmpqpqVFVVVVVVaVZVZVVlaWaWZalpaaampqppVFVRVVVVWVZVZVVlaWaWpqlpVFVRVVUVVVZVVVVVaWZWZaVVFVZVVVVVFVVVVVVpVFVRUVUVFFVVVVVpVFFRUVUVFFVRVVVlVBFRUVUUFFVRVVVlVBFBEVUUFFVRVVUlVBFBEVQUFFFRUVUlVBFBEFQUFBFRUVUlVBEBEFAQFBFBEVUVVBEBEFAVVVVVVVVQFBFBEVQVVBEBEAAVVAEAEAAQFBFBEFQUFBFBUVUQFBEBEFAUFBFBEVUVQAEAAAAAFBEBEFAVQAAAAAAAFBEBEAAVAAAAAAAAFBEAEAA';
    const groups = [];
    for (let i = 0; i < groupsStr.length; i += 8) {
        const groupBitStr = base64ToBit(groupsStr.substr(i, 8));
        const group = [];
        for (let j = 0; j < groupBitStr.length; j += 2) {
            group.push(+`0b${groupBitStr.substr(j, 2)}`);
        }
        groups.push(group);
    }
    const codeMapStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~!@#';
    for (let i = 0; i < codeStr.length; i++) {
        table.push(groups[codeMapStr.indexOf(codeStr[i])]);
    }
}

decompressData();

function getSolarTerm(year, month, date) {
    year = Math.floor(+year);
    month = Math.floor(+month);
    date = Math.floor(+date);
    checkDate(year, month, date);
    const index = (month - 1) * 2 + (date < 15 ? 0 : 1);
    const d = baseDate[index] + table[year - 1901][index];
    if (date == d) {
        return names[index];
    } else {
        return null;
    }
}

const handleTable = [];  //放置的数据
const heavenlyStemStr = '甲乙丙丁戊己庚辛壬癸';
const earthlyBranchStr = '子丑寅卯辰巳午未申酉戌亥';
const zodiacStr = '鼠牛虎兔龙蛇马羊猴鸡狗猪';
const lunarMonthStr = '正二三四五六七八九十冬腊';
const nubmerStr = '一二三四五六七八九十';

function handleData() {
    const base64Str = 'hLaCVwUrqpNDSYNlUaqgrUE1pJXQSuak2FJoaSrqlC1QNailtBK26TcElwpLWyWDUoNqJW1ArYJVySXgkuzJYNSg6lVtSC1oFbHJuCS58loZKhqU20oLVQVqSq2BLoSWlkrCpV7SoNlBaqqrUE2gpbNSuClcVKg6VBqpq1QVaglslK4KVwUmPpMGyrrVQVqCW1UroJWhSamk0NJY1ShaoFtTS2glbBJtKS4Ul1ZLBqUG1GraBVsEq6pLwSXBks2pQdSw1lBawKtlk2hJcGSyalQ1KDaUlqoK1PVbAl0JLVyVhUqFpSWqgrVlVqCXQUtspXBSsKk0dKg1UFapJtQS2alcFJwaTL0mDVMFqja1BLbaV0ErQpNbSWGkoapLtUC1oFbSStgk29JcKSwqlW1KDaQVtGq2CTeEl4JLgyWzUoOpQaqSrYFVwSXHkuDJZ9SoalBtKq1UFagptRS6ClsVKwqVC0prVQVqgq0lLoKWwUrOpODSbuUwaqCtVU2oJbBSuik4NFo6TBqkG1TNagVtBK5KToUWhoqWyUNUg';
    const bitStr = base64ToBit(base64Str);
    let solarDate = { y: 1900, m: 1, d: 31, obj: new Date(1900, 0, 31, 0, 0, 0, 0) };
    let heavenlyStem = 6; // 天干
    let earthlyBranch = 0; // 地支
    for (let i = 0; i < bitStr.length; ) {
        if (i + 16 >= bitStr.length) {
            break;
        }
        const head = bitStr.substr(i, 4);
        i += 4;
        const leapMonth = +`0b${head}`;
        const monthCount = leapMonth > 0 ? 13 : 12;
        const months = bitStr.substr(i, monthCount).split('').map(o => +o);
        i += monthCount;

        handleTable.push({
            solarDate,
            leapMonth,
            months,
            heavenlyStem,
            earthlyBranch
        });

        const dateCount = monthCount*29 + months.filter(o => o == 1).length;
        const newSolarDate = new Date(solarDate.y, solarDate.m - 1, solarDate.d + dateCount, 0, 0, 0, 0);
        solarDate = {
            y: newSolarDate.getFullYear(),
            m: newSolarDate.getMonth() + 1,
            d: newSolarDate.getDate(),
            obj: newSolarDate
        };
        heavenlyStem = (heavenlyStem + 1) % 10;
        earthlyBranch = (earthlyBranch + 1) % 12;
    }
}

handleData();

function isBefore(base, target) {
    if (base.y != target.y) {
        return base.y > target.y;
    } else if (base.m != target.m) {
        return base.m > target.m;
    } else if (base.d != target.d) {
        return base.d > target.d;
    }
    return false;
}

function getLunarStr(month, date, isLeap) {
    const monthStr = `${isLeap ? '闰' : ''}${lunarMonthStr[month - 1]}月`;
    if (date <= 10) {
        return `${monthStr}初${nubmerStr[date - 1]}`;
    } else if (date < 20) {
        return `${monthStr}十${nubmerStr[date - 11]}`;
    } else if (date == 20) {
        return `${monthStr}廿十`;
    } else if (date > 20 && date < 30) {
        return `${monthStr}廿${nubmerStr[date - 21]}`;
    } else {
        return `${monthStr}三十`;
    }
}

export const getLunar = (year, month, date) =>{
    year = Math.floor(+year);
    month = Math.floor(+month);
    date = Math.floor(+date);
    checkDate(year, month, date);
    let index = year - 1900;
    let row = handleTable[index];
    if (isBefore(row.solarDate, { y: year, m: month, d: date })) {
        index -= 1;
        row = handleTable[index];
    }
    if (!row) {
        throw new Error('Invalid Date');
    }
    const targetDate = new Date(year, month - 1, date, 0, 0, 0, 0);
    let delta = Math.round((targetDate.getTime() - row.solarDate.obj.getTime()) / (24*60*60*1000));
    let afterLeap = false;
    for(let i = 0; i < row.months.length; i++) {
        const isLeap = row.leapMonth > 0 && i == row.leapMonth;
        if (isLeap) {
            afterLeap = true;
        }
        const days = 29 + row.months[i];
        if (delta < days) {
            let lunarMonth = afterLeap ? i : i + 1;
            return {
                lunarMonth,
                lunarDate: delta + 1,
                isLeap,
                solarTerm: getSolarTerm(year, month, date),
                lunarYear: `${heavenlyStemStr[row.heavenlyStem]}${earthlyBranchStr[row.earthlyBranch]}`,
                zodiac: `${zodiacStr[row.earthlyBranch]}`,
                dateStr: getLunarStr(lunarMonth, delta + 1, isLeap)
            };
        } else {
            delta -= days;
        }
    }
    throw new Error(`There's something wrong!`);
}

