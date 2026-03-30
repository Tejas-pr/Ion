pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                echo 'Installing Dependencies & Generating Prisma Client...'
                // Inject credentials right at the start
                withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DB_URL')]) {
                    sh "DATABASE_URL=${DB_URL} bun install"
                    sh "DATABASE_URL=${DB_URL} bun run generate"
                }
            }
        }

        stage('Build & Dockerize') {
            steps {
                sh 'bun run build'
                parallel(
                    "Build Ion": { sh 'docker build -t ion-app ./apps/ion' },
                    "Build Repo": { sh 'docker build -t ion-repo-service ./apps/ion-repo-service' },
                    "Build Deployment": { sh 'docker build -t ion-deployment-service ./apps/ion-deployment-service' },
                    "Build Request": { sh 'docker build -t ion-request-service ./apps/ion-request-service' },
                    "Build Websocket": { sh 'docker build -t ion-websocket ./apps/ion-websocket' }
                )
            }
        }
    }

    post {
        always {
            script {
                // node {} Ensures we have a workspace to run shell scripts
                node {
                    echo 'Recording build metadata to Database...'
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
