type ErrorMessageProps = {
  title: string;
  description?: string;
  className?: string;
};

const ErrorMessage = ({title, description, className}: ErrorMessageProps) => {
  if (title) {
    return (
      <div
        className={`p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 ${
          className ? className : ''
        }`}
      >
        <span className='font-medium'>{title}</span>
        {description}
      </div>
    );
  }
  return <></>;
};
export default ErrorMessage;
