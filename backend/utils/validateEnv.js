const validateEnvironmentVariables = () => {
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'FMP_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and add the missing variables.');
    process.exit(1);
  }

  console.log('✅ All required environment variables are present');
};

module.exports = validateEnvironmentVariables;
