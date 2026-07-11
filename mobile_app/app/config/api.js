// Configuration centralisée de l'API pour l'application Mon IUT

export const IP_ADRESS = "192.168.184.88:80";
export const BASE_URL = `http://${IP_ADRESS}/mon-iut`;

export const API_ENDPOINTS = {
  login: `${BASE_URL}/Controllers/etudiantControllers/login.php`,
  get_edt: `${BASE_URL}/Controllers/etudiantControllers/get_edt.php`,
  get_docs: `${BASE_URL}/Controllers/etudiantControllers/get_docs.php`,
  get_notifications: `${BASE_URL}/Controllers/etudiantControllers/get_notifications.php`,
  update_password: `${BASE_URL}/Controllers/etudiantControllers/update_password.php`,
  base_docs: `${BASE_URL}/`,
};
