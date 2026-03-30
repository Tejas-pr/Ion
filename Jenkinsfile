pipeline {
    agent any

    environment {
        // Use the ID from your Jenkins Credentials UI
        DB_URL = credentials('DATABASE_URL')
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies & Generating Prisma Client...'
                sh 'bun install'
                // Pass the DB URL explicitly to Prisma during generation
                sh "DATABASE_URL=${DB_URL} bun run generate"
            }
        }

        stage('Lint & Type Check') {
            steps {
                sh 'bun run lint'
            }
        }

        stage('Build Packages & Apps') {
            steps {
                sh 'bun run build'
            }
        }

        stage('Dockerize Services') {
            parallel {
                stage('Build Ion') {
                    steps { sh 'docker build -t ion-app ./apps/ion' }
                }
                stage('Build Repo') {
                    steps { sh 'docker build -t ion-repo-service ./apps/ion-repo-service' }
                }
                stage('Build Deployment') {
                    steps { sh 'docker build -t ion-deployment-service ./apps/ion-deployment-service' }
                }
                stage('Build Request') {
                    steps { sh 'docker build -t ion-request-service ./apps/ion-request-service' }
                }
                stage('Build Websocket') {
                    steps { sh 'docker build -t ion-websocket ./apps/ion-websocket' }
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Recording build metadata to Database...'
                // We wrap this in a node block to ensure we have a machine
                node('built-in' || 'master' || 'any') {
                    checkout scm
                    sh """
                        cd packages/ion-db
                        DATABASE_URL=${DB_URL} bun run db:record-build \
                        --status=${currentBuild.result ?: 'SUCCESS'} \
                        --duration=${currentBuild.duration} \
                        --commit=\$(git rev-parse HEAD)
                    """
                }
            }
        }
    }
}
