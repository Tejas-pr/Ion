pipeline {
    agent any

    environment {
        // Points to the DB service in your docker-compose network
        DATABASE_URL = "postgresql://ion:ion@db:5432/ion"
        TURBO_TOKEN = "" // Add if using Remote Caching
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies...'
                sh 'bun install'
            }
        }

        stage('Lint & Type Check') {
            steps {
                echo 'Verifying code quality...'
                sh 'bun run lint'
            }
        }

        stage('Build Packages & Apps') {
            steps {
                echo 'Building with Turborepo...'
                sh 'bun run build'
            }
        }

        stage('Dockerize Services') {
            parallel {
                stage('Build Ion') {
                    steps { sh 'docker build -t ion-app ./apps/ion' }
                }
                stage('Build Repo Service') {
                    steps { sh 'docker build -t ion-repo-service ./apps/ion-repo-service' }
                }
                stage('Build Deployment Service') {
                    steps { sh 'docker build -t ion-deployment-service ./apps/ion-deployment-service' }
                }
            }
        }
    }

    post {
        always {
            echo 'Recording build metadata to Database...'
            // This script will be created in the next phase
            sh "bun run --filter @ion/database db:record-build --status=${currentBuild.result ?: 'SUCCESS'} --duration=${currentBuild.duration} --commit=${sh(script: 'git rev-parse HEAD', returnStdout: true).trim()}"
        }
        success {
            echo 'Pipeline Succeeded!'
        }
        failure {
            echo 'Pipeline Failed. Check logs for details.'
        }
    }
}
