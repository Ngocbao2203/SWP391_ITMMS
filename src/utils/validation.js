// Validation utility functions

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const isValidId = (id) => {
  return !isNaN(parseInt(id)) && parseInt(id) > 0;
};

export const sanitizeString = (str) => {
  if (!str) return '';
  return str.toString().trim();
};

export const sanitizeNumber = (num) => {
  const parsed = parseInt(num);
  return isNaN(parsed) ? 0 : parsed;
};

export const validateFormField = (field, value, rules = {}) => {
  const errors = [];
  
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(`${field} là bắt buộc`);
  }
  
  // Email validation
  if (rules.email && value && !isValidEmail(value)) {
    errors.push(`${field} không đúng định dạng email`);
  }
  
  // Phone validation
  if (rules.phone && value && !isValidPhone(value)) {
    errors.push(`${field} phải là số điện thoại hợp lệ (10-11 số)`);
  }
  
  // Min length validation
  if (rules.minLength && value && value.toString().length < rules.minLength) {
    errors.push(`${field} phải có ít nhất ${rules.minLength} ký tự`);
  }
  
  // Max length validation
  if (rules.maxLength && value && value.toString().length > rules.maxLength) {
    errors.push(`${field} không được vượt quá ${rules.maxLength} ký tự`);
  }
  
  return errors;
};

export const validateConsultationForm = (values) => {
  const errors = {};
  
  // Validate symptoms
  const symptomsErrors = validateFormField('Triệu chứng', values.symptoms, {
    required: true,
    minLength: 5,
    maxLength: 1000
  });
  if (symptomsErrors.length > 0) {
    errors.symptoms = symptomsErrors;
  }
  
  // Validate diagnosis
  const diagnosisErrors = validateFormField('Chẩn đoán', values.diagnosis, {
    required: true,
    minLength: 5,
    maxLength: 1000
  });
  if (diagnosisErrors.length > 0) {
    errors.diagnosis = diagnosisErrors;
  }
  
  // Validate treatment
  const treatmentErrors = validateFormField('Điều trị', values.treatment, {
    required: true,
    minLength: 5,
    maxLength: 1000
  });
  if (treatmentErrors.length > 0) {
    errors.treatment = treatmentErrors;
  }
  
  // Validate follow-up appointment date if required
  if (values.followUpRequired && !values.nextAppointmentDate) {
    errors.nextAppointmentDate = ['Vui lòng chọn ngày tái khám'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTreatmentPlan = (values) => {
  const errors = {};
  
  // Validate required fields
  if (!values.treatmentServiceId) {
    errors.treatmentServiceId = ['Vui lòng chọn dịch vụ điều trị'];
  }
  
  if (!values.treatmentType) {
    errors.treatmentType = ['Vui lòng nhập loại điều trị'];
  }
  
  if (!values.description) {
    errors.description = ['Vui lòng nhập mô tả điều trị'];
  }
  
  if (!values.startDate) {
    errors.startDate = ['Vui lòng chọn ngày bắt đầu'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 