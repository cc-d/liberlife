export const decodePayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    const jsonObject = JSON.parse(decodedPayload);
    return jsonObject.sub; // Assuming the JWT payload has a "username" field
  } catch (error) {
    console.error("Error decoding the token", error);
    return null;
  }
};
