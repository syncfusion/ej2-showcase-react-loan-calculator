#!groovy

node('EJ2Component') {
    try {
        deleteDir()        

        stage('Import') {
            git url: 'https://github.com/essential-studio/ej2-groovy-scripts.git', branch: 'master', credentialsId: env.GithubCredentialID
            shared = load 'src/shared.groovy'
        }

        stage('Checkout') {
            checkout scm
            shared.getProjectDetails()
            shared.gitlabCommitStatus('running')
        }

        stage('Install') {
            shared.install()
        }

        deleteDir()
    }
    catch(Exception e) {
        shared.throwError(e)
        deleteDir()        
    }
}
