type ConfigResponse = {
  version: string;
  initial_setup: boolean;
  signup_enabled: boolean;
};

const getConfig = async (): Promise<ConfigResponse> => {
  const response = await fetch("/api/config/");
  return (await response.json()) as ConfigResponse;
};

export { getConfig };
