type InformationalMessageProps = {
  title: string;
  description?: string;
  className?: string;
};

const InformationalMessage = ({title, description, className}: InformationalMessageProps) => {
  if (title) {
    return (
      <div
        className={`p-4 mb-4 text-sm text-black rounded-lg bg-green-50  ${
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
export default InformationalMessage;
