interface LoadingProps {
  fullScreen?: boolean;
}

const Loading = ({ fullScreen = false }: LoadingProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-300"></div>
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="py-8">
      {content}
    </div>
  );
};

export default Loading; 