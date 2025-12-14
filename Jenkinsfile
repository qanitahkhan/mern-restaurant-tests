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
                    echo 'Running Selenium Tests in Docker Container...'
                    
                    docker.image('selenium/standalone-chrome:latest').inside('--shm-size=2g') {
                        sh '''
                            echo "Installing dependencies..."
                            npm install
                            
                            echo "Running Selenium tests..."
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
                    <p><strong>Status:</strong> <span style="color: red;">FAILURE</span></p>
                    <hr>
                    <p>Some tests failed. Please check the console output for details.</p>
                    <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
                """,
                to: "${env.GIT_COMMITTER_EMAIL}",
                mimeType: 'text/html'
            )
        }
    }
}
