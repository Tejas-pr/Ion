pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies & Generating Prisma Client...'
                withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DB_URL')]) {
                    sh "DATABASE_URL=${DB_URL} bun install"
                    sh "DATABASE_URL=${DB_URL} bun run generate"
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
                stage('Ion') { steps { sh 'docker build -t ion-app ./apps/ion' } }
                stage('Repo') { steps { sh 'docker build -t ion-repo-service ./apps/ion-repo-service' } }
                stage('Deployment') { steps { sh 'docker build -t ion-deployment-service ./apps/ion-deployment-service' } }
                stage('Request') { steps { sh 'docker build -t ion-request-service ./apps/ion-request-service' } }
                stage('Websocket') { steps { sh 'docker build -t ion-websocket ./apps/ion-websocket' } }
            }
        }

        stage('Update Database Metadata') {
            steps {
                script {
                    echo 'Recording build details to Postgres...'
                    withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'URL')]) {
                        sh """
                            cd packages/ion-db
                            DATABASE_URL=${URL} bun run db:record-build \
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
