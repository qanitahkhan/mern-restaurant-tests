pipeline {
    agent any
    
    environment {
        GIT_COMMITTER_EMAIL = sh(
            script: 'git log -1 --pretty=format:"%ae"',
            returnStdout: true
        ).trim()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out test code from GitHub...'
                checkout scm
            }
        }
        
        stage('Test') {
            steps {
                script {
                    echo 'Running Selenium Tests in Docker Container with Node.js...'
                    
                    // Use Node.js 18 image and install Chrome inside
                    docker.image('node:18').inside('--shm-size=2g -u root') {
                        sh '''
                            echo "=== Installing Chrome dependencies ==="
                            apt-get update
                            apt-get install -y wget gnupg unzip
                            
                            echo "=== Installing Google Chrome ==="
                            wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
                            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
                            apt-get update
                            apt-get install -y google-chrome-stable
                            
                            echo "=== Checking Chrome version ==="
                            google-chrome --version
                            
                            echo "=== Installing ChromeDriver ==="
                            CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d'.' -f1)
                            wget -q "https://storage.googleapis.com/chrome-for-testing-public/131.0.6778.85/linux64/chromedriver-linux64.zip"
                            unzip -q chromedriver-linux64.zip
                            mv chromedriver-linux64/chromedriver /usr/local/bin/
                            chmod +x /usr/local/bin/chromedriver
                            
                            echo "=== Checking ChromeDriver version ==="
                            chromedriver --version
                            
                            echo "=== Installing npm dependencies ==="
                            npm install
                            
                            echo "=== Running Selenium tests ==="
                            npm test
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Test execution completed"
        }
        success {
            emailext (
                subject: "✅ Jenkins Pipeline SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Test Execution Successful!</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Triggered by:</strong> ${env.GIT_COMMITTER_EMAIL}</p>
                    <p><strong>Status:</strong> <span style="color: green;">SUCCESS</span></p>
                    <hr>
                    <p>All Selenium tests passed successfully!</p>
                    <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
                """,
                to: "${env.GIT_COMMITTER_EMAIL}",
                mimeType: 'text/html'
            )
        }
        failure {
            emailext (
                subject: "❌ Jenkins Pipeline FAILED - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Test Execution Failed!</h2>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Triggered by:</strong> ${env.GIT_COMMITTER_EMAIL}</p>
