import React, { useState } from "react";
import styled from "styled-components";
import Alert from "../../Components/layouts/Alert";
import { createProfile } from "../../actions/profile";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 15px;
  min-height: 100vh;
  display: flex;
  padding-top: 80px;
`;

const CreateProfileBox = styled.div`
  position: relative;
  background-color: #fff;
  margin: auto;
  border-radius: 10px;
  padding: 40px 55px 33px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
`;
const Select = styled.select``;
const Textarea = styled.textarea`
  display: block;
  width: 100%;
  padding: 0.4rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
`;
const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.4rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
`;
const Form = styled.form`
  margin: 1.2rem 0;
`;
const FormText = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #888;
`;

const CreateProfile = ({ history }) => {
  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    youtube: ""
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const dispatch = useDispatch();

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    youtube
  } = formData;
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createProfile(formData, history));
  };
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <CreateProfileBox>
        <Form onSubmit={e => handleSubmit(e)}>
          <div className="form-group">
            <Select
              name="status"
              value={formData.status}
              onChange={e => handleChange(e)}
            >
              <option value="status">* Select Professional Status</option>
              <option value="Developer">Developer</option>
              <option value="Junior Developer">Junior Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Manager">Manager</option>
              <option value="Student or Learning">Student or Learning</option>
              <option value="Instructor">Instructor or Teacher</option>
              <option value="Intern">Intern</option>
              <option value="Other">Other</option>
            </Select>
            <FormText>
              Give us an idea of where you are at in your career
            </FormText>
          </div>
          <div>
            <Input
              type="text"
              name="company"
              placeholder="COMPANY"
              value={formData.company}
              onChange={e => handleChange(e)}
            />
            <FormText>Could be your own company or one you work for</FormText>
          </div>
          <div>
            <Input
              type="text"
              name="website"
              placeholder="WEB-SITE"
              value={formData.website}
              onChange={e => handleChange(e)}
            />
            <FormText>Could be your own or a company website</FormText>
          </div>
          <div>
            <Input
              type="text"
              name="location"
              placeholder="LOCATION"
              value={formData.location}
              onChange={e => handleChange(e)}
            />
            <FormText>City & state suggested (eg. Boston, MA)</FormText>
          </div>
          <div>
            <Input
              type="text"
              name="skills"
              placeholder="SKILLS"
              value={formData.skills}
              onChange={e => handleChange(e)}
            />
            <FormText>
              Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
            </FormText>
          </div>
          <div>
            <Input
              type="text"
              name="githubusername"
              placeholder="Github Username"
              value={formData.githubusername}
              onChange={e => handleChange(e)}
            />
            <FormText>
              If you want your latest repos and a Github link, include your
              username
            </FormText>
          </div>
          <div>
            <Textarea
              placeholder="BIO"
              name="bio"
              value={formData.bio}
              onChange={e => handleChange(e)}
            />
            <FormText>Tell us a little about yourself</FormText>
          </div>
          <div className="my-2">
            <button
              onClick={() => toggleSocialInputs(!displaySocialInputs)}
              type="button"
              // className="btn btn-light"
            >
              Add Social Network Links
            </button>
            <span>Optional</span>
          </div>
          {displaySocialInputs && (
            <>
              <div>
                <Input
                  type="text"
                  name="youtube"
                  placeholder="YOUTUBE"
                  value={formData.youtube}
                  onChange={e => handleChange(e)}
                />
              </div>
            </>
          )}
          <Input type="submit" value="등록" />
        </Form>
      </CreateProfileBox>
    </Container>
  );
};
export default CreateProfile;
