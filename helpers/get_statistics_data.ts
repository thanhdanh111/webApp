import { CheckInCheckOut } from './type';

const getTime = (str: string) => {
  const local = new Date(str);
  const hour = local.getHours();
  const min = local.getMinutes();
  const time = (hour + min / 60);

  return time;
};

const countAvg = (list) => {
  let sum = 0;
  list.forEach((element) => {
    sum += element;
  });

  return sum / list.length;
};

export const getCheckInOutTime = (list) => {

  const checkTimes: number[][] = [];
  const groupByDate = new Map();
  if (!list || list.length === 0) {
    return checkTimes;
  }
  for (const iterator of list) {
    if (iterator == null) {
      continue;
    }
    const date = new Date(new Date(iterator).setHours(0, 0, 0, 0)).getTime();
    if (groupByDate[date] == null) {
      groupByDate[date] = [getTime(iterator)];
      continue;
    }
    groupByDate[date].push(getTime(iterator));
  }

  const keyOfGroupByDate = Object.keys(groupByDate);

  keyOfGroupByDate.forEach((key) => {
    checkTimes.push([Number(key), countAvg(groupByDate[key])]);
  });

  return checkTimes;
};

export const getGraphOptions = (checkInCheckOuts: CheckInCheckOut[]) => {

  const checkIns = checkInCheckOuts.map((element) => element?.checkInAt);

  const checkOuts = checkInCheckOuts.map((element) => element?.checkOutAt);

  return {

    series: [{
      name: 'Check In',
      data: getCheckInOutTime(checkIns),
    }, {
      name: 'Check Out',
      data: getCheckInOutTime(checkOuts),
    }],
    chart: {
      type: 'area',
      height: 100,
      foreColor: '#373737',
      stacked: false,
      dropShadow: {
        enabled: true,
        enabledSeries: [0],
        top: -2,
        left: 2,
        blur: 5,
        opacity: 0.06,
      },
    },
    colors: ['#00E396', '#0090FF'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      strokeColor: '#373737',
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: 0,
        offsetY: 0,
        formatter: (val) => Math.floor(val),
      },
      tooltip: {
        enabled: true,
      },
      min: 0,
      max: 24,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (value) => {
          const hour = Math.floor(value);
          const minutes = Math.floor((value - hour) * 60);
          if (minutes < 10) {
            return `${hour}h0${minutes}`;
          }

          return `${hour}h${minutes}`;
        },
      },

    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    fill: {
      type: 'solid',
      fillOpacity: 0.7,
    },
  };
};
