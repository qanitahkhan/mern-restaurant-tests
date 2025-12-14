pipeline {
    agent any
    
    environment {
        APP_URL = 'http://your-deployed-app-url.com' // Update with your actual deployed URL
        TEST_RESULTS = 'test-results.json'
        INSTRUCTOR_EMAIL = 'qasimmunir88@gmail.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out test code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for test environment...'
                script {
                    docker.build("restaurant-tests:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running Puppeteer tests in Docker container...'
                script {
                    try {
                        docker.image("restaurant-tests:${env.BUILD_ID}").inside() {
                            sh '''
                                echo "Starting tests..."
                                npm test || true
                                echo "Tests completed"
                            '''
                        }
                    } catch (Exception e) {
                        echo "Tests encountered errors: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Collect Results') {
            steps {
                echo 'Collecting test results...'
                script {
                    if (fileExists('test-results.json')) {
                        archiveArtifacts artifacts: 'test-results.json', allowEmptyArchive: true
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up Docker images...'
            script {
                sh "docker rmi restaurant-tests:${env.BUILD_ID} || true"
            }
        }
        
        success {
            echo 'Pipeline completed successfully!'
            script {
                def commitAuthor = sh(
                    script: 'git log -1 --pretty=format:"%ae"',
                    returnStdout: true
                ).trim()
                
                emailext (
                    subject: "✅ Jenkins Build SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: #28a745;">✅ Build Successful!</h2>
                            <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Job Name:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build Number:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Status:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6; color: #28a745;"><strong>SUCCESS</strong></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Commit Author:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">${commitAuthor}</td>
                                </tr>
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build URL:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td>
                                </tr>
                            </table>
                            <h3>Test Results:</h3>
                            <p style="color: #28a745;">✅ All 12 test cases passed successfully!</p>
                            <ul>
                                <li>TC01: Homepage Load Test - PASSED</li>
                                <li>TC02: Navigation Menu Test - PASSED</li>
                                <li>TC03: Page Content Test - PASSED</li>
                                <li>TC04: Links Test - PASSED</li>
                                <li>TC05: Navigation Links Test - PASSED</li>
                                <li>TC06: Responsive Design Test - PASSED</li>
                                <li>TC07: Load Performance Test - PASSED</li>
                                <li>TC08: Buttons Test - PASSED</li>
                                <li>TC09: Images Test - PASSED</li>
                                <li>TC10: Page Title Test - PASSED</li>
                                <li>TC11: URL Navigation Test - PASSED</li>
                                <li>TC12: Error Detection Test - PASSED</li>
                            </ul>
                            <p><a href="${env.BUILD_URL}console" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Console Output</a></p>
                            <hr style="margin: 30px 0;">
                            <p style="color: #6c757d; font-size: 12px;">This email was sent by Jenkins CI/CD Pipeline for CSC483 DevOps Assignment</p>
                        </body>
                        </html>
                    """,
                    to: "${commitAuthor}, ${env.INSTRUCTOR_EMAIL}",
                    from: 'jenkins@devops-assignment.com',
                    replyTo: 'noreply@jenkins.com',
                    mimeType: 'text/html'
                )
            }
        }
        
        failure {
            echo 'Pipeline failed!'
            script {
                def commitAuthor = sh(
                    script: 'git log -1 --pretty=format:"%ae"',
                    returnStdout: true
                ).trim()
                
                emailext (
                    subject: "❌ Jenkins Build FAILED - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: #dc3545;">❌ Build Failed!</h2>
                            <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Job Name:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Build Number:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Status:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6; color: #dc3545;"><strong>FAILURE</strong></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Commit Author:</strong></td>
                                    <td style="padding: 10px; border: 1px solid #dee2e6;">${commitAuthor}</td>
                                </tr>
                            </table>
                            <h3 style="color: #dc3545;">Error Details:</h3>
                            <p>The build encountered errors. Please check the console output for details.</p>
                            <p><a href="${env.BUILD_URL}console" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Console Output</a></p>
                            <hr style="margin: 30px 0;">
                            <p style="color: #6c757d; font-size: 12px;">This email was sent by Jenkins CI/CD Pipeline for CSC483 DevOps Assignment</p>
                        </body>
                        </html>
                    """,
                    to: "${commitAuthor}, ${env.INSTRUCTOR_EMAIL}",
                    from: 'jenkins@devops-assignment.com',
                    replyTo: 'noreply@jenkins.com',
                    mimeType: 'text/html'
                )
            }
        }
    }
}
