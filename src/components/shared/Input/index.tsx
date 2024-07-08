import classNames from 'classnames';
import {Field, FieldAttributes} from 'formik';

interface IProps extends FieldAttributes<any> {}

const Input = ({className, ...rest}: IProps) => (
  <Field
    className={classNames([
      'appearance-none block w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm',
      className,
    ])}
    {...rest}
  />
);
export default Input;
