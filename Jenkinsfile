pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies & Generating Prisma Client...'
                // Ensure we use the exact version of Prisma everywhere
                withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
                    sh 'bun install'
                    sh 'bun x prisma -v'
                    sh 'bun x prisma generate --force'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'bun run build'
            }
        }

        stage('Dockerize') {
            parallel {
                stage('Ion') { steps { sh 'docker build -t ion-app -f apps/ion/Dockerfile .' } }
                stage('Repo') { steps { sh 'docker build -t ion-repo-service -f apps/ion-repo-service/Dockerfile .' } }
                stage('Deployment') { steps { sh 'docker build -t ion-deployment-service -f apps/ion-deployment-service/Dockerfile .' } }
                stage('Request') { steps { sh 'docker build -t ion-request-service -f apps/ion-request-service/Dockerfile .' } }
                stage('Websocket') { steps { sh 'docker build -t ion-websocket -f apps/ion-websocket/Dockerfile .' } }
            }
        }
    }

    post {
        always {
            script {
                echo 'Recording build details to Postgres...'
                try {
                    withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
                        def commit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        def durationMillis = currentBuild.duration.toString()
                        def status = currentBuild.result ?: (currentBuild.currentResult ?: 'FAILURE')

                        sh """
                            cd packages/ion-db
                            bun run db:record-build \
                            --status=${status} \
                            --duration=${durationMillis} \
                            --commit=${commit} \
                            --project=ion
                        """
                    }
                } catch (err) {
                    echo "Warning: Failed to record build metadata: ${err.message}"
                }
            }
        }
    }
}
