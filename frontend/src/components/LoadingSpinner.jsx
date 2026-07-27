function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;