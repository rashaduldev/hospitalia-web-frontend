export default {
  nav: {
    home: "Home",
    patient: "Patient Login",
    doctor: "Doctor / Secretary Login",
  },
  banner: {
    titleMain: "Simplify patient experience",
    titleSub: "Streamline healthcare providers’ work.",
    cardTitle: "Get Appointment",
    cardSubtitle: "Nice to see you again!",
    doctor: "Doctor",
    hospital: "Hospital",
    selectCity: "Select City",
    searchHere: "Search Here",
    searchBtn: "Search",
  },
  stats: {
    patients: "Patient Served",
    monthlyUsers: "Monthly Active Users",
    doctors: "Professional Doctors",
  },
  whyChooseUs: {
    title: "Why Choose Us?",
    subtitle: "Trusted by thousands for quality, expertise, and results.",
    stats: {
      stat0: { count: "200+", des: "Clinics Across Senegal" },
      stat1: { count: "20+", des: "Years of Experience" },
      stat2: { count: "5k", des: "Professional Doctors" },
      stat3: { count: "24/7", des: "Support Availability" },
    },
  },
  ourPackages: {
    title: "Our Health Packages",
    earlyPregnancy: "Early Pregnancy Pack",
    generalHealth: "General Health Checkup",
    cardiacCare: "Cardiac Care Package",

    antenatal: "Antenatal Checkup",
    ultrasound: "Ultrasound Scan",
    bloodUrine: "Blood & Urine Tests",

    doctorConsult: "Doctor Consultation",
    bpCheck: "Blood Pressure Check",
    basicLab: "Basic Lab Tests",

    ecg: "ECG Test",
    heartConsult: "Heart Specialist Consultation",
    cholesterol: "Cholesterol Test",

    checkBtn: "Check Details",
  },
  login: {
    title: "Login as a Provider",
    description: "Enter your details below to login",

    phoneLabel: "Phone",
    passwordLabel: "Password",

    loginBtn: "Login",
    loginLoading: "Login...",

    noAccount: "Don't have an account? Sign up",
    forgotPassword: "Forgot your password?",
    errors: {
      countryRequired: "Country code is required",
      phoneRequired: "Mobile number is required",
      phoneShort: "Phone number is too short",
      phoneLong: "Phone number is too long",
      passwordMin: "Password must be at least 6 characters",
    },
  },
  table: {
    search: "Search by date, location",
    no_results_for: "No results found. Try adjusting your search criteria.",
    export: "Export",
    selected: "selected",
    noData: "No appointments found",
    showing: "Showing",
    of: "of",
    results: "products",
    previous: "Previous",
    next: "Next",
    appointment_details: "Appointment Details",
    actions: "Actions",
    view_details: "View Details",
    mark_completed: "Mark as Completed",
    cancel: "Cancel",
    con_cancel: "Confirm Cancellation",
    sureText: "Are you sure you want to cancel the appointment for",
    nokeepit: "No, Keep it",
    column: {
      duration: "Time Duration",
      patientName: "Patients Name",
      location: "Location",
      appointmentDate: "Date",
      timeslot: "Time Slot",
    },
  },

  common: {
    somethingWrong: "Something went wrong",
  },
  register: {
    title: "Join Rendewou as a Provider",
    personalInfo: "Personal Information",
    professionalInfo: "Professional Information",

    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    userType: "User Type",
    email: "Email",
    dateOfBirth: "Date of Birth",
    phone: "Phone",

    password: "Password",
    confirmPassword: "Confirm Password",

    designation: "Title / Designation",
    speciality: "Speciality",
    onms: "ONMS Registration Number",
    statement: "Professional Statement",

    submit: "Register as a Healthcare Provider",
    creating: "Creating account...",
    alreadyAccount: "Already Have an Account?",

    genderOptions: {
      male: "Male",
      female: "Female",
    },

    userTypeOptions: {
      doctor: "Doctor",
      hospital: "Hospital",
      secretary: "Secretary",
    },

    errors: {
      firstNameRequired: "First name is required",
      firstNameMin: "First name must be at least 2 characters",
      firstNameMax: "First name must be at max 50 characters",
      lastNameMax: "Last name must be at max 50 characters",
      genderRequired: "Gender is required",
      invalidEmail: "Invalid email address",
      userTypeRequired: "User type is required",
      emailRequired: "Email is required",
      emailMax: "First name must be at max 80 characters",
      countryRequired: "Country code is required",
      phoneRequired: "Mobile number is required",
      phoneShort: "Mobile number is too short",
      phoneLong: "Mobile number is too long",
      passwordMin: "Password must be at least 8 characters",
      passwordMax: "Password must be at max 32 characters",
      passwordUppercase: "Password must contain at least one uppercase letter",
      passwordNumber: "Password must contain at least one number",
      passwordSpecial: "Password must contain at least one special character",
      passwordStrength:
        "Password must contain uppercase, lowercase, number and special character",

      confirmPasswordRequired: "Confirm password is required",

      designationRequired: "Designation is required",
      specialityRequired: "Speciality is required",

      passwordNotMatch: "Passwords do not match",
      designation: "Designation is required",
      speciality: "Speciality is required",
      onmsRegistrationNumber: "Onms Registration Number is required",
    },
  },
  appoinment: {
    today: "Todays Appointments",
    todaydescription: "See all of your appointments scheduled today",
    upcoming: "Upcoming Appointments",
    upcomingdescription: "See all of your upcoming appointments",
    no_today: "There are no today's appointments.",
    no_upcoming: "There are no upcoming appointments.",
  },
  availability: {
    title: "Default Locations and Time Slots",
    description: "Default Locations and Time Slots",
    deafult_location: "Default Locations",
    hospital_name_search: "Enter Hospital/Clinic Name",
    hospital_location_search: "Enter Hospital/Clinic Address",
    postal_code_placeh: "Ex: 1207",
    city_placeh: "Enter your city",
    delete_title: "Are you sure?",
    delete_description:
      "This location will be permanently deleted. This cannot be undone. Are you sure you want to delete?",
    btn_no: "No",
    btn_deleting: "Deleting...",
    btn_yes: "Yes, Delete",
  },
  unauthorized: {
    title: "Access Denied",
    description:
      "You do not have the required permissions to access this dashboard area. Please contact administration if you believe this is an error.",
    go_back: "Go Back",
    return_home: "Return Home",
    error_code: "Error Code",
  },
  schedule: {
    title: "Select Consultation Schedule",
    description: "Select the days you want to set availability for",
    select_day: "Select the Day",
  },
  unavailability: {
    title: "Schedule Exceptions",
    description: "Select the date you want to be unavailable for",
    date: "Date",
    btn: "Set as Unavailable",
    success_message: "Date set as unavailable successfully",
    error_message: "Failed to set unavailability",
    already_set: "This day is already set as unavailable",
  },
};
