import { ToastContainer, cssTransition } from 'react-toastify';

const toastTransition = cssTransition({
  enter: 'pos-toast-enter',
  exit: 'pos-toast-exit',
  duration: [220, 160],
});

export function AppToaster() {
  return (
    <ToastContainer
      autoClose={3200}
      closeOnClick
      draggable={false}
      hideProgressBar={false}
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      position="top-right"
      role="status"
      transition={toastTransition}
    />
  );
}
