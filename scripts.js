
const getSituation = () => {
  const doors = [
    {
      firstSelected: false,
      secondSelected: false,
      winner: false,
      canOpen: true,
      opened: false
    },
    {
      firstSelected: false,
      secondSelected: false,
      winner: false,
      canOpen: true,
      opened: false
    },
    {
      firstSelected: false,
      secondSelected: false,
      winner: false,
      canOpen: true,
      opened: false
    }
  ];

  const winnerIdx = Math.floor(Math.random() * 3);
  doors[winnerIdx].winner = true;
  doors[winnerIdx].canOpen = false;
  
  const selectedIdx = Math.floor(Math.random() * 3);
  doors[selectedIdx].firstSelected = true;
  doors[selectedIdx].canOpen = false;
  
  const doorsThatCanBeOpened = doors.filter(d => d.canOpen);
  doorsThatCanBeOpened[Math.floor(Math.random() * doorsThatCanBeOpened.length)].opened = true;
  const doorsStillClosed = doors.filter(d => !d.opened && !d.firstSelected);
  doorsStillClosed[0].secondSelected = true;
  return doors;
}


const init = () => {
  $("#playGames").on("click",() => drawChart(playGames($("#gamesCount").val())));
};

const playGames = (totalGames) => {
  if (totalGames > 1000000) {
    totalGames = 1000000;
    $("#gamesCount").val(totalGames);
  }
  var countFirst = 0;
  var countSecond = 0;
  var countAlter = 0;
  var errors = 0;
  const interval = Math.floor(totalGames / 100);
  const xTicks = [0];
  const yFirst = [0];
  const ySecond = [0];
  const yAlter = [0];
  for (var i=0;i<totalGames*1;i++){
    const doors = getSituation();
    countFirst += doors.filter(d => d.winner && d.winner === d.firstSelected).length;
    countSecond += doors.filter(d => d.winner && d.winner === d.secondSelected).length;
    countAlter+=
        i%2?doors.filter(d => d.winner && d.winner === d.firstSelected).length
        :doors.filter(d => d.winner && d.winner === d.secondSelected).length;
      
    if(i!=0 && i%interval==0) {
      xTicks.push(i);
      yFirst.push(Math.round(countFirst*100/i));
      ySecond.push(Math.round(countSecond*100/i));
      yAlter.push(Math.round(countAlter*100/i));
    }
  }

  return {totalGames,xTicks,yFirst,ySecond,yAlter,countFirst,countSecond,countAlter};
}

const drawChart = (chartData) => {


		var pieConfig = {
			type: 'pie',
			data: {
				datasets: [{
					data: [
            chartData.countFirst,
            chartData.countSecond
					],
					backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
					],
					label: 'Percentages'
        },
				],
				labels: [
					'Stay',
					'Switch',
				]
			},
			options: {
        responsive: true,
        title: {
            display: true,
            text: "Stay vs Switch Door choices",
          },
			}
		};

		var ctx = document.getElementById("chart-area").getContext("2d");
      if  (window.myPie) window.myPie.destroy();
        
        window.myPie = new Chart(ctx, pieConfig);
      
var pieConfigAlter = {
			type: 'pie',
			data: {
				datasets: [{
					data: [
            chartData.countAlter,
            chartData.totalGames - chartData.countAlter
					],
					backgroundColor: [
            "rgb(255,205,86)",
            "rgb(128, 128, 128)",
					],
        },
				],
				labels: [
					'Won',
					'Lost',
				]
			},
			options: {
        responsive: true,
        title: {
            display: true,
            text: "Won vs lost (Alternating scenario)",
          },
			}
		};

		var ctx = document.getElementById("chart-area-alter").getContext("2d");
      if  (window.myPieAlter) window.myPieAlter.destroy();
        
        window.myPieAlter = new Chart(ctx, pieConfigAlter);
     

var lineConfig = {
        type: "line",
        data: {
          labels: chartData.xTicks,
          datasets: [
            {
              label: "Stay",
              fill: false,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              data: chartData.yFirst,
            },
            {
              label: "Switch",
              fill: false,
              backgroundColor: "rgb(54, 162, 235)",
              borderColor: "rgb(54, 162, 235)",
              data: chartData.ySecond,
            },
            {
              label: "Alternating",
              fill: false,
              backgroundColor: "rgb(255,205,86)",
              borderColor: "rgb(255,205,86)",
              data: chartData.yAlter,
            }
          ],
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Percentages of Stay, Switch and Alternating scenarios",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Games played",
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Percentage of games won",
                },
              },
            ],
          },
        },
      };
var ctx2 = document.getElementById("canvas").getContext("2d");
      if  (window.myLine) window.myLine.destroy();
        
        window.myLine = new Chart(ctx2, lineConfig);
      
    }