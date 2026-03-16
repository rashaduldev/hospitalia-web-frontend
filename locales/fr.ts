export default {
  nav: {
    home: "Accueil",
    logout: "Déconnexion",
    patient: "Connexion Patient",
    doctor: "Connexion Docteur / Secrétaire",
  },

  banner: {
    titleMain: "Simplifiez l'expérience des patients",
    titleSub: "Optimisez le travail des prestataires de santé.",
    cardTitle: "Prendre un rendez-vous",
    cardSubtitle: "Ravi de vous revoir !",
    doctor: "Docteur",
    hospital: "Hôpital",
    selectCity: "Sélectionner la ville",
    searchHere: "Rechercher ici",
    searchBtn: "Rechercher",
    searching: "Recherche en cours...",
    searchSchema: "Veuillez entrer un nom ou un mot-clé",
  },

  stats: {
    patients: "Patients servis",
    monthlyUsers: "Utilisateurs actifs mensuels",
    doctors: "Médecins professionnels",
  },

  whyChooseUs: {
    title: "Pourquoi nous choisir ?",
    subtitle:
      "Approuvé par des milliers de personnes pour la qualité, l'expertise et les résultats.",
    stats: {
      stat0: { count: "200+", des: "Cliniques à travers le Sénégal" },
      stat1: { count: "20+", des: "Années d'expérience" },
      stat2: { count: "5k", des: "Médecins professionnels" },
      stat3: { count: "24/7", des: "Support disponible" },
    },
  },

  ourPackages: {
    title: "Nos forfaits de santé",
    earlyPregnancy: "Forfait grossesse précoce",
    generalHealth: "Bilan de santé général",
    cardiacCare: "Forfait soins cardiaques",

    antenatal: "Contrôle prénatal",
    ultrasound: "Échographie",
    bloodUrine: "Analyses de sang et d'urine",

    doctorConsult: "Consultation médicale",
    bpCheck: "Vérification de la pression artérielle",
    basicLab: "Tests de laboratoire de base",

    ecg: "Test ECG",
    heartConsult: "Consultation avec un spécialiste du cœur",
    cholesterol: "Test de cholestérol",

    checkBtn: "Voir les détails",
  },

  login: {
    title: "Connexion en tant que prestataire",
    doctortitle: "Connexion en tant que Prestataire",
    description: "Entrez vos informations ci-dessous pour vous connecter",

    phoneLabel: "Téléphone",
    passwordLabel: "Mot de passe",

    loginBtn: "Se connecter",
    loginLoading: "Connexion...",

    noAccount: "Vous n'avez pas de compte ? Inscrivez-vous",
    forgotPassword: "Mot de passe oublié ?",

    errors: {
      invalidPhone: "Numéro de téléphone invalide",
      phoneRequired: "Le numéro de téléphone est requis",
      phoneShort: "Le numéro de téléphone est trop court",
      phoneLong: "Le numéro de téléphone est trop long",
      passwordMin: "Le mot de passe doit contenir au moins 6 caractères",
    },
  },

  table: {
    search: "Rechercher par date, lieu",
    no_results_for:
      "Aucun résultat trouvé. Essayez d'ajuster vos critères de recherche.",
    export: "Exporter",
    selected: "sélectionné",
    noData: "Aucun rendez-vous trouvé",
    showing: "Affichage",
    of: "de",
    results: "produits",
    previous: "Précédent",
    next: "Suivant",
    appointment_details: "Détails du rendez-vous",
    actions: "Actions",
    view_details: "Voir les détails",
    mark_completed: "Marquer comme terminé",
    cancel: "Annuler",
    con_cancel: "Confirmer l'annulation",
    sureText: "Êtes-vous sûr de vouloir annuler le rendez-vous pour",
    nokeepit: "Non, garder",

    column: {
      duration: "Durée",
      patientName: "Nom du patient",
      location: "Lieu",
      appointmentDate: "Date",
      timeslot: "Créneau horaire",
    },
  },
  common: {
    somethingWrong: "Une erreur s'est produite",
  },

  register: {
    title: "Rejoignez Rendewou en tant que prestataire",
    personalInfo: "Informations personnelles",
    professionalInfo: "Informations professionnelles",

    firstName: "Prénom",
    lastName: "Nom de famille",
    gender: "Genre",
    userType: "Type d'utilisateur",
    email: "Email",
    dateOfBirth: "Date de naissance",
    phone: "Téléphone",

    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",

    designation: "Titre / Désignation",
    speciality: "Spécialité",
    onms: "Numéro d'enregistrement ONMS",
    statement: "Déclaration professionnelle",

    submit: "S'inscrire en tant que prestataire de santé",
    creating: "Création du compte...",
    alreadyAccount: "Vous avez déjà un compte ?",

    genderOptions: {
      male: "Homme",
      female: "Femme",
    },

    userTypeOptions: {
      doctor: "Docteur",
      hospital: "Hôpital",
      secretary: "Secrétaire",
    },

    errors: {
      firstNameRequired: "Le prénom est requis",
      firstNameMin: "Le prénom doit contenir au moins 2 caractères",
      firstNameMax: "Le prénom doit contenir au maximum 50 caractères",
      lastNameMax: "Le nom de famille doit contenir au maximum 50 caractères",
      genderRequired: "Le genre est requis",
      invalidEmail: "Adresse email invalide",
      userTypeRequired: "Le type d'utilisateur est requis",
      emailRequired: "L'email est requis",
      emailMax: "L'email doit contenir au maximum 80 caractères",
      countryRequired: "L'indicatif du pays est requis",
      phoneRequired: "Le numéro de téléphone est requis",
      phoneShort: "Le numéro de téléphone est trop court",
      phoneLong: "Le numéro de téléphone est trop long",
      passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
      passwordMax: "Le mot de passe doit contenir au maximum 32 caractères",
      passwordUppercase:
        "Le mot de passe doit contenir au moins une lettre majuscule",
      passwordNumber: "Le mot de passe doit contenir au moins un chiffre",
      passwordSpecial:
        "Le mot de passe doit contenir au moins un caractère spécial",
      passwordStrength:
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial",

      confirmPasswordRequired: "La confirmation du mot de passe est requise",

      designationRequired: "La désignation est requise",
      specialityRequired: "La spécialité est requise",

      passwordNotMatch: "Les mots de passe ne correspondent pas",
      designation: "La désignation est requise",
      speciality: "La spécialité est requise",
      onmsRegistrationNumber: "Le numéro d'enregistrement ONMS est requis",
      professionalStatementLong:
        "La déclaration professionnelle est trop longue.",
    },
  },

  appoinment: {
    today: "Rendez-vous d'aujourd'hui",
    todaydescription: "Voir tous vos rendez-vous programmés aujourd'hui",
    upcoming: "Rendez-vous à venir",
    upcomingdescription: "Voir tous vos prochains rendez-vous",
    no_today: "Il n'y a pas de rendez-vous aujourd'hui.",
    no_upcoming: "Il n'y a pas de rendez-vous à venir.",
  },

  availability: {
    title: "Lieux et créneaux horaires par défaut",
    description: "Lieux et créneaux horaires par défaut",
    deafult_location: "Lieux par défaut",
    no_deafult_location: "Vous n'avez aucun lieu par défaut ajouté.",
    hospital_name_search: "Entrez le nom de l'hôpital / clinique",
    hospital_location_search: "Entrez l'adresse de l'hôpital / clinique",
    postal_code_placeh: "Entrez votre code postal (numérique)",
    city_placeh: "Entrez votre ville",

    delete_title: "Êtes-vous sûr ?",
    delete_description:
      "Ce lieu sera supprimé définitivement. Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ?",

    btn_no: "Non",
    btn_deleting: "Suppression...",
    btn_yes: "Oui, supprimer",
  },
  unauthorized: {
    title: "Accès refusé",
    description:
      "Vous n'avez pas les autorisations nécessaires pour accéder à cette zone du tableau de bord. Veuillez contacter l'administration si vous pensez qu'il s'agit d'une erreur.",
    go_back: "Retour",
    return_home: "Retour à l'accueil",
    error_code: "Code d'erreur",
  },

  schedule: {
    title: "Sélectionner le planning de consultation",
    description:
      "Sélectionnez les jours pour lesquels vous souhaitez définir la disponibilité",
    select_day: "Sélectionner le jour",
  },

  unavailability: {
    title: "Exceptions de planning",
    description:
      "Sélectionnez la date pour laquelle vous souhaitez être indisponible",
    date: "Date",
    btn: "Définir comme indisponible",
    success_message: "La date a été définie comme indisponible avec succès",
    error_message: "Échec de la définition de l'indisponibilité",
    already_set: "Ce jour est déjà défini comme indisponible",
    currently_unavailable:
      "Le médecin est actuellement indisponible à cette date.",
    currently_available: "Le médecin est disponible à cette date.",
    set_available_btn: "Définir comme disponible",
    remove_success: "La date est de nouveau disponible.",
    undo_btn: "Rendre disponible",
    confirmed_slots: "Créneaux confirmés",
    confirmed_slots_des: "Tous vos créneaux horaires confirmés",
  },

  location: {
    errors: {
      nameRequired: "Le nom du lieu est requis",
      nameTooLong: "Le nom du lieu est trop long",
      addressRequired: "L'adresse du lieu est requise",
      addressTooLong: "L'adresse du lieu est trop longue",
      cityRequired: "La ville est requise",
      cityTooLong: "Le nom de la ville est trop long",
      postalRequired: "Le code postal est requis",
      postalTooLong: "Le code postal est trop long",
    },
  },

  booking: {
    booking_appoinment: "Prendre rendez-vous",
    booking_des:
      "DISPONIBLE SUR DEMANDE : La confirmation de disponibilité peut nécessiter un traitement supplémentaire de votre demande avec le médecin.",
    available_dates: "Dates disponibles",
    available_slots: "Créneaux disponibles",
    select_date_first: "Veuillez d'abord sélectionner une date",
    no_slot_available:
      "Aucun créneau disponible pour cette date. Veuillez essayer un autre jour.",
    select_location: "Sélectionner le lieu",
    confirm_booking: "Confirmer la réservation",

    patient_types: {
      new: "Nouveau patient : 25 000 CFA",
      returning: "Patient existant : 10 000 CFA",
    },

    login: {
      title: "Authentification requise",
      des: "Veuillez vous connecter à votre compte pour confirmer cette réservation. Seuls les patients enregistrés peuvent prendre des rendez-vous.",
      cancel_btn: "Annuler",
      login_btn: "Aller à la connexion",
    },

    errors: {
      locationRequired: "Veuillez sélectionner un lieu",
      dateRequired: "Veuillez sélectionner une date de rendez-vous",
      slotRequired: "Veuillez sélectionner un créneau horaire",
      patientTypeRequired: "Veuillez sélectionner votre statut de patient",
    },
  },
};
