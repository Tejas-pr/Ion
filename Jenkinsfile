pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies & Generating Prisma Client...'
                // We name the variable DATABASE_URL so Turbo picks it up automatically!
                withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
                    sh 'bun install --allow-scripts'
                    sh 'bun run generate'
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

        stage('Update Database Metadata') {
            steps {
                script {
                    echo 'Recording build details to Postgres...'
                    withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
                        sh """
                            cd packages/ion-db
                            bun run db:record-build \
                            --status=${currentBuild.result ?: 'SUCCESS'} \
                            --duration=${currentBuild.duration} \
                            --commit=\$(git rev-parse HEAD)
                        """
                    }
                }
            }
        }
    }
}
