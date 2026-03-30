pipeline {
    agent any

    environment {
        // Points to Jenkins Credential ID 'DATABASE_URL'
        DATABASE_URL = credentials('DATABASE_URL')
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies & Generating Prisma Client...'
                sh 'bun install'
                sh 'bun run generate'
            }
        }

        stage('Build & Test') {
            steps {
                sh 'bun run build'
            }
        }

        stage('Dockerize Services') {
            parallel {
                stage('Build Ion') { steps { sh 'docker build -t ion-app ./apps/ion' } }
                stage('Build Repo') { steps { sh 'docker build -t ion-repo-service ./apps/ion-repo-service' } }
                stage('Build Deployment') { steps { sh 'docker build -t ion-deployment-service ./apps/ion-deployment-service' } }
                stage('Build Request') { steps { sh 'docker build -t ion-request-service ./apps/ion-request-service' } }
                stage('Build Websocket') { steps { sh 'docker build -t ion-websocket ./apps/ion-websocket' } }
            }
        }
    }

    post {
        always {
            echo 'Recording build metadata to Database...'
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
