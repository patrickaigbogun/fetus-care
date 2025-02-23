const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

export const neonDbUrl = {
  apiKey: getEnvironmentVariable("NEON_DATABASE_URL"),
};

export const cloudinaryName = {
  apiKey: getEnvironmentVariable("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
};

export const cloudinaryApiKey = {
  apiKey: getEnvironmentVariable("NEXT_PUBLIC_CLOUDINARY_API_KEY"),
};

export const cloudinaryApiSecret = {
  apiKey: getEnvironmentVariable("CLOUDINARY_API_SECRET"),
};

export const cloudinaryUrl = {
  apiKey: getEnvironmentVariable("API_ENV_VARIABLE_CLOUDINARY_URL"),
};

export const supabase = {
  supabase_url: getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
  supabase_anon_key: getEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  connection_url: getEnvironmentVariable("SUPABASE_DATABASE_URL"),
};

export const agora = {
  appId: getEnvironmentVariable("NEXT_PUBLIC_AGORA_APP_ID"),
  token: getEnvironmentVariable("NEXT_PUBLIC_AGORA_TEMP_TOKEN"),
//   channel: getEnvironmentVariable("CHANNEL"),
};

export const backendApi = {
  endpoint: getEnvironmentVariable("BACKEND_API_ENDPOINT"),
};
