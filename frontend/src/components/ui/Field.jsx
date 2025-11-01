import React, { createContext, useCallback, useContext, useId, useMemo, useState, useEffect } from 'react';
import './Field.css';

const FieldContext = createContext(null);

const useFieldContext = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('Field components must be used within <Field>');
  }
  return context;
};

const Field = ({
  id,
  error,
  required = false,
  className = '',
  children
}) => {
  const generatedId = useId();
  const baseId = id || `field-${generatedId}`;
  const [describedByIds, setDescribedByIds] = useState([]);

  const registerDescription = useCallback((descriptionId) => {
    setDescribedByIds((prev) => {
      if (prev.includes(descriptionId)) return prev;
      return [...prev, descriptionId];
    });

    return () => {
      setDescribedByIds((prev) => prev.filter((value) => value !== descriptionId));
    };
  }, []);

  const contextValue = useMemo(() => ({
    baseId,
    controlId: `${baseId}-control`,
    describedByIds,
    registerDescription,
    error,
    required
  }), [baseId, describedByIds, registerDescription, error, required]);

  const classes = ['ui-field'];
  if (error) {
    classes.push('ui-field--error');
  }
  if (className) {
    classes.push(className);
  }

  return (
    <FieldContext.Provider value={contextValue}>
      <div className={classes.join(' ')} data-invalid={Boolean(error)}>
        {children}
      </div>
    </FieldContext.Provider>
  );
};

const FieldLabel = ({ children, className = '' }) => {
  const { controlId, required } = useFieldContext();
  const classes = ['ui-field__label'];
  if (className) classes.push(className);

  return (
    <label className={classes.join(' ')} htmlFor={controlId}>
      <span>{children}</span>
      {required && <span className="ui-field__required-indicator" aria-hidden="true">*</span>}
    </label>
  );
};

const FieldControl = ({ children }) => {
  const { controlId, describedByIds, error, required } = useFieldContext();

  if (!React.isValidElement(children)) {
    return children;
  }

  const existingDescribedBy = children.props['aria-describedby'];
  const describedBy = [existingDescribedBy, ...describedByIds]
    .filter(Boolean)
    .join(' ') || undefined;

  return React.cloneElement(children, {
    id: children.props.id || controlId,
    'aria-describedby': describedBy,
    'aria-invalid': typeof children.props['aria-invalid'] !== 'undefined'
      ? children.props['aria-invalid']
      : Boolean(error),
    'aria-required': typeof children.props['aria-required'] !== 'undefined'
      ? children.props['aria-required']
      : required
  });
};

const FieldDescription = ({ children, className = '' }) => {
  const { baseId, registerDescription } = useFieldContext();
  const descriptionId = `${baseId}-description-${useId()}`;

  useEffect(() => registerDescription(descriptionId), [registerDescription, descriptionId]);

  const classes = ['ui-field__description'];
  if (className) classes.push(className);

  return (
    <p id={descriptionId} className={classes.join(' ')}>
      {children}
    </p>
  );
};

const FieldMessage = ({ children, className = '' }) => {
  const { baseId, registerDescription, error } = useFieldContext();
  const messageContent = children ?? error;
  const hasMessage = Boolean(messageContent);
  const messageId = `${baseId}-message`;

  useEffect(() => {
    if (!hasMessage) return undefined;
    return registerDescription(messageId);
  }, [hasMessage, messageId, registerDescription]);

  if (!hasMessage) return null;

  const classes = ['ui-field__message'];
  if (error) classes.push('ui-field__message--error');
  if (className) classes.push(className);

  return (
    <p id={messageId} className={classes.join(' ')} role={error ? 'alert' : undefined}>
      {messageContent}
    </p>
  );
};

Field.Label = FieldLabel;
Field.Control = FieldControl;
Field.Description = FieldDescription;
Field.Message = FieldMessage;

export default Field;



