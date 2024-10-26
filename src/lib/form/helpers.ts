export const formatFormData = (data: FormData): Record<string, any> => {
  const entries = Array.from(data.entries());
  const result: Record<string, any> = {};

  entries.forEach(([key, value]) => {
    // Handle array fields (fields with [] in the name)
    if (key.endsWith('[]')) {
      const cleanKey = key.slice(0, -2);
      if (!result[cleanKey]) {
        result[cleanKey] = [];
      }
      result[cleanKey].push(value);
    } else {
      result[key] = value;
    }
  });

  return result;
};

export const serializeFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value as string);
    }
  });

  return formData;
};

export const getFormValues = (form: HTMLFormElement): Record<string, any> => {
  const formData = new FormData(form);
  return formatFormData(formData);
};

export const setFormValues = (form: HTMLFormElement, data: Record<string, any>): void => {
  Object.entries(data).forEach(([key, value]) => {
    const element = form.elements.namedItem(key) as HTMLInputElement | null;
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = Boolean(value);
      } else if (element.type === 'radio') {
        const radio = form.querySelector(`input[name="${key}"][value="${value}"]`) as HTMLInputElement;
        if (radio) radio.checked = true;
      } else {
        element.value = value as string;
      }
    }
  });
};

export const resetForm = (form: HTMLFormElement): void => {
  form.reset();
  const event = new Event('reset', { bubbles: true });
  form.dispatchEvent(event);
};

export const validateForm = (
  form: HTMLFormElement,
  validators: Record<string, (value: any) => string | null>
): Record<string, string | null> => {
  const values = getFormValues(form);
  const errors: Record<string, string | null> = {};

  Object.entries(validators).forEach(([field, validator]) => {
    const value = values[field];
    errors[field] = validator(value);
  });

  return errors;
};
