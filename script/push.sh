branch_name=$([ -z "$1" ] && echo "development" || echo "$1")
git push -u origin $branch_name
gh repo sync nagatech-si/payroll-api -b $branch_name