interface ErrorMessageProps {
  label: string;
  text: string;
}
const ErrorMessage = ({ label, text }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center md:gap-4">
      <h3 className="text-preset-4 md:text-preset-2 text-neutral-100">{label}</h3>

      <p className="text-preset-5 md:text-preset-4 max-w-90 text-neutral-200 md:max-w-115">
        {text}
      </p>
    </div>
  );
};

export default ErrorMessage;
