function NetworkState({ onNetworkState }) {
  window.onoffline = () => {
    console.log('offline');
    onNetworkState();
  };
  window.ononline = () => {
    console.log('online');
    onNetworkState();
  };
}

export default NetworkState;
