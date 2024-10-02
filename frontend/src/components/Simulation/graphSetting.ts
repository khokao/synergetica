export const graphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Simulation Result",
    },
  },
  scales: {
    x: {
      display: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: "Time",
      },
    },
    y: {
      title: {
        display: true,
        text: "Protein Levels",
      },
    },
  },
};
