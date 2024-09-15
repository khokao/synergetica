export const getGraphOptions = () => ({
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
      display: false,
    },
    y: {
      title: {
        display: true,
        text: "Protein Levels",
      },
    },
  },
});
